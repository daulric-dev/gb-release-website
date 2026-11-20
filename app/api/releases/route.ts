import { NextResponse } from 'next/server'

export const revalidate = 300

const releasesUrl = 'https://api.github.com/repos/daulric-dev/gb/releases?per_page=30'

type GitHubAsset = {
  id: number
  name: string
  size: number
  download_count: number
  browser_download_url: string
  url: string
  digest: string | null
}

type GitHubRelease = {
  id: number
  tag_name: string
  name: string | null
  published_at: string | null
  body: string | null
  html_url: string
  prerelease: boolean
  draft: boolean
  assets: GitHubAsset[]
}

function getPlatform(filename: string) {
  const name = filename.toLowerCase()
  if (/sha256|checksum|\.sig$|\.asc$/.test(name)) return { platform: 'Checksums', arch: 'SHA256' }
  if (/\.dmg$|\.pkg$/.test(name)) return { platform: 'macOS', arch: /arm64|aarch64/.test(name) ? 'Apple silicon' : /x64|x86_64/.test(name) ? 'Intel' : 'Universal' }
  if (/\.exe$|\.msi$/.test(name)) return { platform: 'Windows', arch: /arm64/.test(name) ? 'ARM64' : /x86|i386/.test(name) ? 'x86' : 'x64' }
  if (/\.appimage$|\.deb$|\.rpm$|\.tar\.gz$/.test(name)) return { platform: 'Linux', arch: /arm64|aarch64/.test(name) ? 'ARM64' : /x86|i386/.test(name) ? 'x86' : 'x64' }
  if (/\.zip$|\.tar$|\.gz$/.test(name)) return { platform: 'Archive', arch: 'Universal' }
  return { platform: 'Other', arch: 'Universal' }
}

function formatNotes(notes: string | null) {
  if (!notes?.trim()) return 'No release notes were provided for this version.'
  return notes
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*(.*?)\*\*|__(.*?)__/g, '$1$2')
    .replace(/\*(.*?)\*|_(.*?)_/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export async function GET() {
  try {
    const response = await fetch(releasesUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'gb-release-downloads',
      },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      const message = response.status === 404
        ? 'The repository has no public releases yet.'
        : response.status === 403
          ? 'GitHub is temporarily rate-limiting release requests. Please try again shortly.'
          : 'GitHub could not return releases right now.'
      return NextResponse.json({ error: message }, { status: response.status === 404 ? 200 : 502 })
    }

    const githubReleases = await response.json() as GitHubRelease[]
    const latestStableId = githubReleases.find((release) => !release.prerelease && !release.draft)?.id
    const releases = githubReleases.filter((release) => !release.draft).map((release) => ({
      id: release.id,
      version: release.tag_name,
      title: release.name,
      date: release.published_at,
      tag: release.id === latestStableId,
      prerelease: release.prerelease,
      notes: formatNotes(release.body),
      htmlUrl: release.html_url,
      assets: release.assets.map((asset) => ({
        id: asset.id,
        name: asset.name,
        ...getPlatform(asset.name),
        size: formatBytes(asset.size),
        downloads: asset.download_count,
        browserDownloadUrl: asset.browser_download_url,
        digest: asset.digest,
      })),
    }))

    return NextResponse.json({
      repository: { owner: 'daulric-dev', name: 'gb', url: 'https://github.com/daulric-dev/gb' },
      releases,
    })
  } catch {
    return NextResponse.json({ error: 'Unable to reach GitHub right now. Please try again shortly.' }, { status: 502 })
  }
}

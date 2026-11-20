'use client'

import { useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, Check, CircleHelp, Copy, FileArchive, GitBranch, HardDriveDownload, Search, ShieldCheck, Sparkles, Terminal } from 'lucide-react'

type Asset = { name: string; platform: string; arch: string; size: string; downloads: string; kind: string }
type Release = { version: string; date: string; tag: string; notes: string; assets: Asset[] }

const releases: Release[] = [
  { version: '2.8.1', date: 'Nov 18, 2026', tag: 'Latest', notes: 'A fresh batch of improvements. Faster startup, smaller bundles, and a handful of fixes that make the whole thing feel a little more polished.', assets: [
    { name: 'orbit_2.8.1_macos_arm64.dmg', platform: 'macOS', arch: 'Apple silicon', size: '84.2 MB', downloads: '12.4k', kind: 'DMG' },
    { name: 'orbit_2.8.1_macos_x64.dmg', platform: 'macOS', arch: 'Intel', size: '88.6 MB', downloads: '3.2k', kind: 'DMG' },
    { name: 'orbit_2.8.1_windows_x64.exe', platform: 'Windows', arch: 'x64', size: '92.1 MB', downloads: '8.1k', kind: 'EXE' },
    { name: 'orbit_2.8.1_linux_x64.AppImage', platform: 'Linux', arch: 'x64', size: '96.8 MB', downloads: '2.7k', kind: 'APPIMAGE' },
    { name: 'orbit_2.8.1_checksums.txt', platform: 'Checksums', arch: 'SHA256', size: '1.2 KB', downloads: '1.8k', kind: 'TXT' },
  ]},
  { version: '2.8.0', date: 'Nov 04, 2026', tag: '', notes: 'Introducing workspace sync, a brand new command palette, and performance improvements across the board.', assets: [
    { name: 'orbit_2.8.0_macos_arm64.dmg', platform: 'macOS', arch: 'Apple silicon', size: '83.9 MB', downloads: '6.3k', kind: 'DMG' },
    { name: 'orbit_2.8.0_windows_x64.exe', platform: 'Windows', arch: 'x64', size: '91.7 MB', downloads: '4.2k', kind: 'EXE' },
    { name: 'orbit_2.8.0_linux_x64.AppImage', platform: 'Linux', arch: 'x64', size: '95.1 MB', downloads: '1.5k', kind: 'APPIMAGE' },
  ]},
  { version: '2.7.4', date: 'Oct 21, 2026', tag: '', notes: 'A small maintenance release with stability improvements and a few important bug fixes.', assets: [
    { name: 'orbit_2.7.4_macos_arm64.dmg', platform: 'macOS', arch: 'Apple silicon', size: '82.1 MB', downloads: '9.1k', kind: 'DMG' },
    { name: 'orbit_2.7.4_windows_x64.exe', platform: 'Windows', arch: 'x64', size: '89.3 MB', downloads: '5.8k', kind: 'EXE' },
  ]},
]
const filters = ['All platforms', 'macOS', 'Windows', 'Linux', 'Checksums']

function GitHubMark({ size = 18 }: { size?: number }) {
  return <GitBranch size={size} strokeWidth={2} aria-hidden="true" />
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All platforms')
  const [copied, setCopied] = useState(false)
  const visibleReleases = useMemo(() => releases.map((release) => ({ ...release, assets: release.assets.filter((asset) => (filter === 'All platforms' || asset.platform === filter) && `${asset.name} ${asset.platform} ${asset.arch}`.toLowerCase().includes(query.toLowerCase())) })).filter((release) => release.assets.length), [filter, query])

  async function copyCommand() {
    await navigator.clipboard.writeText('brew install --cask orbit')
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#151821]">
      <header className="border-b border-[#e9ebef] bg-white">
        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-[-0.03em]" aria-label="Orbit downloads home"><span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5b5de6] text-white"><Sparkles size={17} /></span><span className="text-[17px]">orbit<span className="text-[#8d91a0]">/</span>downloads</span></a>
          <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#707584] sm:flex"><a className="text-[#272a35]" href="#releases">Releases</a><a className="transition hover:text-[#272a35]" href="#install">Installation</a><a className="transition hover:text-[#272a35]" href="https://github.com" target="_blank" rel="noreferrer">Documentation <ArrowUpRight size={13} className="ml-0.5 inline" /></a></nav>
          <a href="https://github.com/orbit-app/orbit" target="_blank" rel="noreferrer" className="flex h-9 items-center gap-2 rounded-lg border border-[#e7e9ed] px-3 text-[12px] font-semibold transition hover:border-[#bfc3cd] hover:bg-[#fafbfc]"><GitHubMark size={15} /><span className="hidden sm:inline">View on GitHub</span><span className="sm:hidden">GitHub</span></a>
        </div>
      </header>

      <section id="top" className="mx-auto max-w-[1180px] px-5 pb-8 pt-12 lg:px-8 lg:pb-10 lg:pt-[68px]">
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#8b8f9b]"><span>Home</span><span className="text-[#c4c7ce]">/</span><span>Downloads</span><span className="text-[#c4c7ce]">/</span><span className="font-medium text-[#5e6270]">Orbit</span></div>
        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><div className="mb-4 flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#242631] text-white"><GitHubMark size={15} /></span><span className="text-[13px] font-medium text-[#767b89]">orbit-app <span className="text-[#c0c3ca]">/</span> orbit</span><span className="rounded-full border border-[#e7e9ed] bg-white px-2 py-0.5 text-[10px] font-medium text-[#747887]">Public</span></div><h1 className="text-[38px] font-semibold leading-[1.1] tracking-[-0.055em] sm:text-[48px]">Downloads<span className="text-[#c3c6cf]">.</span></h1><p className="mt-3 max-w-[540px] text-[14px] leading-6 text-[#7a7f8d]">Everything you need to get started with Orbit. Grab the latest version for your platform.</p></div>
          <div className="flex items-center gap-2 pb-1"><div className="flex items-center gap-1.5 rounded-lg border border-[#e8e9ed] bg-white px-3 py-2 text-xs text-[#737785]"><span className="h-1.5 w-1.5 rounded-full bg-[#4cb782]"/>All systems operational</div><span className="hidden text-xs text-[#8d919e] sm:inline">·</span><span className="hidden text-xs text-[#8d919e] sm:inline">Updated 2 days ago</span></div>
        </div>
        <div className="mt-8 flex flex-wrap gap-2.5"><div className="flex items-center gap-2 rounded-lg border border-[#eceef1] bg-white px-3 py-2 text-xs text-[#626775]"><span className="font-semibold text-[#383b46]">Latest</span><span className="rounded bg-[#eaeaff] px-1.5 py-0.5 font-semibold text-[#5b5de6]">v2.8.1</span></div><div className="flex items-center gap-2 rounded-lg border border-[#eceef1] bg-white px-3 py-2 text-xs text-[#626775]"><ShieldCheck size={14} className="text-[#42a879]"/>Signed &amp; verified</div><div className="flex items-center gap-2 rounded-lg border border-[#eceef1] bg-white px-3 py-2 text-xs text-[#626775]"><HardDriveDownload size={14} className="text-[#858997]"/>26.8k downloads</div></div>
      </section>

      <section id="releases" className="mx-auto max-w-[1180px] px-5 pb-16 lg:px-8">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-[18px] font-semibold tracking-[-0.025em]">Available releases</h2><p className="mt-1 text-[12px] text-[#858997]">Choose a package to download. All builds include automatic updates.</p></div><div className="relative w-full sm:w-[238px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9da1ad]"/><input aria-label="Search release files" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files..." className="h-9 w-full rounded-lg border border-[#e7e9ed] bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-[#a3a6b0] focus:border-[#9899eb] focus:ring-2 focus:ring-[#5b5de6]/10"/></div></div>
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`shrink-0 rounded-md px-3 py-1.5 text-[11px] font-medium transition ${filter === item ? 'bg-[#22242d] text-white' : 'bg-white text-[#737785] ring-1 ring-inset ring-[#e9eaee] hover:bg-[#f3f4f6]'}`}>{item}</button>)}</div>
        <div className="space-y-3">
          {visibleReleases.length ? visibleReleases.map((release) => <article key={release.version} className="overflow-hidden rounded-xl border border-[#e7e9ed] bg-white shadow-[0_1px_2px_rgba(21,24,33,0.025)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eff0f3] px-4 py-3.5 sm:px-5"><div className="flex flex-wrap items-center gap-2.5"><span className="text-[16px] font-semibold tracking-[-0.035em]">v{release.version}</span>{release.tag && <span className="rounded-md bg-[#eaeaff] px-2 py-1 text-[10px] font-semibold text-[#5b5de6]">{release.tag}</span>}<span className="text-[11px] text-[#969aa5]">Released {release.date}</span></div><a href={`https://github.com/orbit-app/orbit/releases/tag/v${release.version}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] font-medium text-[#797e8c] transition hover:text-[#5b5de6]">Release notes <ArrowUpRight size={12}/></a></div>
            <p className="px-4 pt-3 text-[12px] leading-5 text-[#777c89] sm:px-5">{release.notes}</p>
            <div className="px-3 pb-2 pt-2 sm:px-4"><div className="hidden grid-cols-[minmax(0,1fr)_130px_90px_96px] items-center px-2 py-2 text-[10px] font-medium uppercase tracking-[0.07em] text-[#a0a3ad] sm:grid"><span>Package</span><span>Platform</span><span>Size</span><span className="text-right">Downloads</span></div>
              {release.assets.map((asset) => <div key={asset.name} className="group flex flex-col gap-3 rounded-lg px-2 py-3 transition hover:bg-[#f8f9fb] sm:grid sm:grid-cols-[minmax(0,1fr)_130px_90px_96px] sm:items-center sm:gap-0"><div className="flex min-w-0 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#eceef1] bg-white text-[#747989]"><FileArchive size={15}/></span><div className="min-w-0"><p className="truncate text-[12px] font-medium text-[#343742]">{asset.name}</p><p className="mt-0.5 text-[10px] text-[#a0a3ad] sm:hidden">{asset.platform} · {asset.arch} · {asset.size}</p></div></div><span className="hidden text-[11px] text-[#737785] sm:block">{asset.platform} <span className="text-[#a2a5af]">· {asset.arch}</span></span><span className="hidden text-[11px] text-[#737785] sm:block">{asset.size}</span><div className="flex items-center justify-between sm:justify-end sm:gap-3"><span className="text-[10px] text-[#a0a3ad] sm:hidden">{asset.downloads} downloads</span><span className="hidden text-[10px] text-[#a0a3ad] sm:inline">{asset.downloads}</span><a href={`https://github.com/orbit-app/orbit/releases/download/v${release.version}/${asset.name}`} target="_blank" rel="noreferrer" aria-label={`Download ${asset.name}`} className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#5b5de6] px-3 text-[11px] font-medium text-white transition hover:bg-[#4d4fd0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b5de6] focus-visible:ring-offset-2"><ArrowDownToLine size={13}/>Download</a></div></div>)}
            </div>
          </article>) : <div className="rounded-xl border border-dashed border-[#dfe1e7] bg-white py-14 text-center"><Search size={20} className="mx-auto text-[#b7bac4]"/><p className="mt-3 text-sm font-medium text-[#424550]">No matching files</p><p className="mt-1 text-xs text-[#9094a0]">Try another search or platform filter.</p></div>}
        </div>
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#969aa5]"><CircleHelp size={13}/>Can&apos;t find your platform? <a href="https://github.com/orbit-app/orbit/issues" target="_blank" rel="noreferrer" className="font-medium text-[#666a78] underline decoration-[#c6c8d0] underline-offset-2 hover:text-[#5b5de6]">Let us know</a></div>
      </section>

      <section id="install" className="border-t border-[#e8eaf0] bg-white"><div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-5 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f1ff] text-[#5b5de6]"><Terminal size={17}/></span><div><h2 className="text-[13px] font-semibold">Prefer the terminal?</h2><p className="mt-1 text-[11px] text-[#828693]">Install Orbit with Homebrew on macOS.</p></div></div><button onClick={copyCommand} className="flex max-w-full items-center justify-between gap-5 rounded-lg border border-[#e9eaee] bg-[#fafbfc] px-3 py-2.5 text-left font-mono text-[11px] text-[#555968] transition hover:border-[#d7d9e0]"><span><span className="mr-2 text-[#acafba]">$</span>brew install --cask orbit</span><span className="text-[#8e92a0]">{copied ? <Check size={14} className="text-[#42a879]"/> : <Copy size={14}/>}</span></button></div></section>
      <footer className="border-t border-[#e9ebef] bg-[#f7f8fa]"><div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-5 py-5 text-[10px] text-[#989ca7] sm:flex-row lg:px-8"><span>© 2026 Orbit. Open source, made with care.</span><div className="flex items-center gap-4"><a href="https://github.com/orbit-app/orbit" target="_blank" rel="noreferrer" className="hover:text-[#5b5de6]">GitHub</a><a href="https://github.com/orbit-app/orbit/blob/main/LICENSE" target="_blank" rel="noreferrer" className="hover:text-[#5b5de6]">License</a><a href="https://github.com/orbit-app/orbit/issues" target="_blank" rel="noreferrer" className="hover:text-[#5b5de6]">Support</a></div></div></footer>
    </main>
  )
}

const parseYouTubeId = url => {
  const m = url.match(
    /(?:(?:youtube\.com.*(?:[?&]v=|\/embed\/|\/[1-9]\/|\/v\/))|youtu\.be\/)([^&\n?#]+)/
  )
  return m ? m[1] : undefined
}

const parseVimeoId = url => {
  const m = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/)
  return m ? m[2] || m[1] : undefined
}
const parseWistiaId = url => {
  const m = url.match(/^.+wistia.(com|net)\/(.*\/)?([^#\?]*)/)
  return m ? m[3] || m[1] : undefined
}

const buildYouTubeUrl = id =>
  id && "https://www.youtube.com/embed/" + id + "?rel=0&autoplay=0&showinfo=0&controls=0"

const buildVimeoUrl = id => id && "https://player.vimeo.com/video/" + id

const buildWistiaUrl = id => id && "https://fast.wistia.net/embed/iframe/" + id

export const parsers = [
  { id: "YouTube", parseId: parseYouTubeId, buildUrl: buildYouTubeUrl },
  { id: "Vimeo", parseId: parseVimeoId, buildUrl: buildVimeoUrl },
  { id: "Wistia", parseId: parseWistiaId, buildUrl: buildWistiaUrl }
]

export default parsers

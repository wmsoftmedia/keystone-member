export const getParentPath = path => {
  return path.split(".").reduce((acc, v, i, arr) => {
    const maybeDot = acc === "" ? "" : "."
    return i + 1 === arr.length ? acc : acc + maybeDot + v
  }, "")
}

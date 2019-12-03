module.exports = {
  aliases: {
    _: "lodash/fp",
    PropTypes: "prop-types",
    "lib/keystone": "keystone"
  },
  importStatementFormatter({ importStatement }) {
    return importStatement.replace(/;$/, "")
  },
  moduleNameFormatter({ moduleName }) {
    return moduleName.replace(/src\//, "")
  },
  useRelativePaths({ pathToImportedModule }) {
    const rel = []
    const useRelative =
      rel.findIndex(function(r) {
        return pathToImportedModule.endsWith(r)
      }) >= 0
    if (useRelative) {
      return true
    }
    false
  }
}

export function getCompLevelTitle(compLevel: string, shorten?: boolean): string {
  switch(compLevel) {
    case "qm":
      return shorten ? "Quals" : "Qualifications";
    case "qf":
      return shorten ? "Quarters" : "Quarterfinals";
    case "sf":
      return shorten ? "Semis" : "Semifinals";
    case "f":
      return "Finals";
    default:
      return ""
  }
}

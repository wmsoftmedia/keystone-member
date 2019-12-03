import { AppleBoxIcon, AvocadoBoxIcon, MelonBoxIcon, OrangeBoxIcon } from "kui/icons"
import { gradients } from "kui/colors"

const STREAKS = [7, 28, 90]

export const calcAchievementInfo = streak => {
  const streakLen = streak <= STREAKS[0] ? 7 : streak <= STREAKS[1] ? 28 : STREAKS[2]
  const daysLeft = streakLen - streak

  if (streak <= STREAKS[0]) {
    const message =
      daysLeft === 0
        ? "Congrats on your first achievement! Keep it up!"
        : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left until your first achievement`
    return {
      len: streakLen,
      title: daysLeft === 0 ? "Amateur Apple" : "Beginner Avocado",
      message,
      segments: 7,
      startLabel: "DAY 1",
      endLabel: "DAY 7",
      gradient: daysLeft === 0 ? gradients.red : gradients.green,
      icon: daysLeft === 0 ? AppleBoxIcon : AvocadoBoxIcon
    }
  }

  if (streak <= STREAKS[1]) {
    const message =
      daysLeft === 0
        ? "Congratulations, Professor Orange! Keep going!"
        : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left until your next achievement.`
    return {
      len: streakLen,
      title: daysLeft === 0 ? "Professor Orange" : "Amateur Apple",
      message,
      segments: 4,
      startLabel: "WEEK 1",
      endLabel: "WEEK 4",
      gradient: daysLeft === 0 ? gradients.orange : gradients.red,
      icon: daysLeft === 0 ? OrangeBoxIcon : AppleBoxIcon
    }
  }

  return {
    len: streakLen,
    title: daysLeft <= 0 ? "Melon Master" : "Professor Orange",
    message:
      daysLeft <= 0
        ? "You're mangonificent! Don't stop now."
        : `${daysLeft} day${
            daysLeft === 1 ? "" : "s"
          } left until your final achievement!`,
    segments: 3,
    startLabel: "MONTH 1",
    endLabel: "MONTH 3+",
    gradient: daysLeft <= 0 ? gradients.yellow : gradients.orange,
    icon: daysLeft <= 0 ? MelonBoxIcon : OrangeBoxIcon
  }
}

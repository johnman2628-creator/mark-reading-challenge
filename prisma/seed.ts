import { PrismaClient } from '@prisma/client'
import { buildSermonUrlForPlanDay } from '../lib/youtubePlaylist'

const prisma = new PrismaClient()

const planDays = [
  { day: 1, passage: "1:1–1:20", verseCount: 20, theme: "序言與呼召", chapter: "第一章" },
  { day: 2, passage: "1:21–1:39", verseCount: 19, theme: "迦百農的權柄與醫治", chapter: "第一章" },
  { day: 3, passage: "1:40–2:12", verseCount: 18, theme: "潔淨長大痲瘋的；抬褥子的人", chapter: "第二章" },
  { day: 4, passage: "2:13–2:28", verseCount: 16, theme: "召利未；禁食辯論", chapter: "第二章" },
  { day: 5, passage: "3:1–3:19", verseCount: 19, theme: "安息日醫治；選十二使徒", chapter: "第三章" },
  { day: 6, passage: "3:20–3:35", verseCount: 16, theme: "家屬；褻瀆聖靈", chapter: "第三章" },
  { day: 7, passage: "4:1–4:20", verseCount: 20, theme: "撒種的比喻", chapter: "第四章（A）" },
  { day: 8, passage: "4:21–4:41", verseCount: 21, theme: "燈與度量；平靜風浪", chapter: "第四章（B）" },
  { day: 9, passage: "5:1–5:20", verseCount: 20, theme: "格拉森趕鬼", chapter: "第五章" },
  { day: 10, passage: "5:21–5:43", verseCount: 23, theme: "睚魯的女兒與血漏的婦人", chapter: "第五章" },
  { day: 11, passage: "6:1–6:13", verseCount: 13, theme: "故鄉與差遣門徒", chapter: "第六章" },
  { day: 12, passage: "6:14–6:44", verseCount: 31, theme: "施洗約翰之死；五餅二魚", chapter: "第六章" },
  { day: 13, passage: "6:45–6:56", verseCount: 12, theme: "水面行走；革尼撒勒醫治", chapter: "第六章" },
  { day: 14, passage: "7:1–7:23", verseCount: 23, theme: "古人的遺傳", chapter: "第七章" },
  { day: 15, passage: "7:24–7:37", verseCount: 14, theme: "外邦婦人；聾啞人得醫治", chapter: "第七章" },
  { day: 16, passage: "8:1–8:21", verseCount: 21, theme: "四千人；求神蹟與酵", chapter: "第八章" },
  { day: 17, passage: "8:22–8:38", verseCount: 17, theme: "伯賽大瞎子；彼得認信與捨己", chapter: "第八章" },
  { day: 18, passage: "9:1–9:29", verseCount: 29, theme: "登山變像；下山趕鬼", chapter: "第九章" },
  { day: 19, passage: "9:30–9:50", verseCount: 21, theme: "第二預告；誰為大；不敵擋", chapter: "第九章" },
  { day: 20, passage: "10:1–10:31", verseCount: 31, theme: "休妻；祝福小孩；財主", chapter: "第十章" },
  { day: 21, passage: "10:32–10:52", verseCount: 21, theme: "上耶路撒冷：第三次預告受難；雅各約翰求首位；瞎子巴底買得看見", chapter: "第十章" },
  { day: 22, passage: "11:1–11:25", verseCount: 25, theme: "受難週開始：騎驢進京（棕枝主日）；潔淨聖殿；無花果樹的教訓", chapter: "第十一章" },
  { day: 23, passage: "11:26–12:17", verseCount: 25, theme: "聖殿衝突：質疑耶穌權柄；惡園戶比喻；納稅給凱撒", chapter: "第十二章" },
  { day: 24, passage: "12:18–12:44", verseCount: 27, theme: "聖殿教導：復活辯論；最大的誡命；窮寡婦的兩個小錢", chapter: "第十二章" },
  { day: 25, passage: "13:1–13:23", verseCount: 23, theme: "橄欖山講論（上）：聖殿被毀預告；末世災難與假基督", chapter: "第十三章（A）" },
  { day: 26, passage: "13:24–14:11", verseCount: 25, theme: "橄欖山講論（下）與陰謀：人子降臨；儆醒；祭司設計；伯大尼膏抹", chapter: "第十三章（B）" },
  { day: 27, passage: "14:12–14:42", verseCount: 31, theme: "逾越節夜：預備筵席；設立聖餐；預告彼得不認；客西馬尼禱告", chapter: "第十四章（A）" },
  { day: 28, passage: "14:43–14:72", verseCount: 30, theme: "夜間受審：猶大親嘴出賣；被捕；公會審問；彼得三次不認主", chapter: "第十四章（C）" },
  { day: 29, passage: "15:1–15:32", verseCount: 32, theme: "受難日（上）：解交彼拉多；鞭打受辱；帶到各各他；釘十字架", chapter: "第十五章（A）" },
  { day: 30, passage: "15:33–16:20", verseCount: 35, theme: "受難日與復活：耶穌斷氣；埋葬；七日的第一日從死裡復活", chapter: "第十五章（B）至第十六章" },
]

async function main() {
  console.log('開始種子資料...')

  for (const day of planDays) {
    const record = {
      ...day,
      sermonUrl: buildSermonUrlForPlanDay(day.day),
    }
    await prisma.planDay.upsert({
      where: { day: day.day },
      update: record,
      create: record,
    })
  }

  console.log(`已建立 ${planDays.length} 日讀經計劃`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

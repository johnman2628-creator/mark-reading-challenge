# 查經信息 ↔ 30 日讀經計劃 mapping

Playlist: [馬可福音查經](https://www.youtube.com/playlist?list=PLsEwVzkhyD7dcUYEgIdK0dz1OcIQ0qhg4)（24 videos）

Playlist titles are **reverse chapter order** (ch.15B–16 → 綜覽). Mapping is by **Mark chapter(s)** in each day’s `passage`, not by playlist index = plan day.

## Rules

- One video per chapter → **reuse** on every plan day whose primary chapter is that chapter.
- Distinct A/B(/C…) parts → assign in reading order when the chapter spans multiple plan days.
- Cross-chapter passages use the plan’s focus chapter (seed `chapter` label / majority).
- Unused playlist items: `綜覽`, `13C`, `14B`, `14D`, `14E`.

## Day → sermon

| Day | Passage | Sermon key | Video title |
|----:|---------|------------|-------------|
| 1 | 1:1–1:20 | `1` | 馬可福音第一章 |
| 2 | 1:21–1:39 | `1` | （reuse） |
| 3 | 1:40–2:12 | `2` | 馬可福音第二章 |
| 4 | 2:13–2:28 | `2` | （reuse） |
| 5–6 | ch.3 | `3` | 馬可福音第三章 |
| 7 | 4:1–4:20 | `4A` | 馬可福音第四章（A） |
| 8 | 4:21–4:41 | `4B` | 馬可福音第四章（B） |
| 9–10 | ch.5 | `5` | 馬可福音第五章 |
| 11–13 | ch.6 | `6` | 馬可福音第六章 |
| 14–15 | ch.7 | `7` | 馬可福音第七章 |
| 16–17 | ch.8 | `8` | 馬可福音第八章 |
| 18–19 | ch.9 | `9` | 馬可福音第九章 |
| 20–21 | ch.10 | `10` | 馬可福音第十章 |
| 22 | 11:1–11:25 | `11` | 馬可福音第十一章 |
| 23–24 | ch.12 (day 23 starts 11:26) | `12` | 馬可福音第十二章 |
| 25 | 13:1–13:23 | `13A` | 馬可福音第十三章（A） |
| 26 | 13:24–14:11 | `13B` | 馬可福音第十三章（B） |
| 27 | 14:12–14:42 | `14A` | 馬可福音第十四章（A） |
| 28 | 14:43–14:72 | `14C` | 馬可福音第十四章（C）（arrest / trial） |
| 29 | 15:1–15:32 | `15A` | 馬可福音第十五章（A） |
| 30 | 15:33–16:20 | `15B-16` | 馬可福音第十五章（B）至第十六章 |

Implemented in `lib/youtubePlaylist.ts` (`PLAN_DAY_SERMON_KEYS` + `buildSermonUrlForPlanDay`). Seed writes `sermonUrl` via the same helper.

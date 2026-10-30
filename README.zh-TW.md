<img src="assets/logo.svg" width="64" height="64" alt="">

# whatsmyagentdoing

[English](README.md) | **繁體中文**

**一個 Claude Code / Codex skill：輸入 `/myoffice`，就能在一間小辦公室裡即時看到你電腦上每個 Claude Code、Codex、Gemini CLI、Copilot CLI、OMP（oh-my-pi）、Kimi Code、DeepSeek Harness 和 Grok Build agent 正在做什麼。**

**網站：** https://charonyuu.github.io/whatsmyagentdoing/

OMP 支援：[路徑、設定檔（profile）、接續（Resume）與限制](docs/omp.md)。

![3D 辦公室：上班中的 agent 坐在座位上，下班的在四處閒晃](docs/office-3d.gif)

| 中畫質（2D） | 列表 |
|---|---|
| ![2D 辦公室](docs/office-2d.gif) | ![列表檢視](docs/list.gif) |

<sub>以 `--demo`（虛構的團隊）錄製，畫面中沒有任何真實的 session。</sub>

## 安裝

**最簡單：請你的 agent 幫你裝。** 把下面這段貼到 Claude Code 或 Codex：

> 從 https://github.com/Charonyuu/whatsmyagentdoing 安裝 myoffice skill：用 `git clone --depth 1` clone 到 `~/.claude/skills/myoffice`（Codex 則是 `~/.codex/skills/myoffice`），確認 `node --version` 是 18 以上，然後提醒我開一個新的 session 並輸入 /myoffice。

或是自己動手：

```bash
# Claude Code
git clone --depth 1 https://github.com/Charonyuu/whatsmyagentdoing ~/.claude/skills/myoffice

# Codex
git clone --depth 1 https://github.com/Charonyuu/whatsmyagentdoing ~/.codex/skills/myoffice
```

接著輸入 **`/myoffice`**（或直接問 *「我的 agent 在幹嘛？」*），辦公室就會在瀏覽器中打開。之後要更新，執行 `git -C ~/.claude/skills/myoffice pull` 即可。

需要 Node.js 18 以上。不需要 `npm install`，clone 下來就能直接跑。不想用 skill？在 clone 下來的資料夾裡執行 `node bin/cli.js` 也可以。

打開後會看到一間等角視角的**辦公室**。正在工作的 agent 坐在隔間座位上：思考時頭上冒出想法泡泡，執行工具時一邊打字、螢幕上捲動著程式碼，需要你的時候會站起來揮手。幾個剛完成工作的 agent 會留下來「下班」閒晃：到茶水間倒咖啡、裝水，窩在沙發和懶骨頭上，逛書櫃，站在會議室白板前，打大型電玩，打桌球、玩手足球（剛好有兩個人閒著時），躲進電話亭，或是趴在空位上睡午覺。其他人都已經回家了。窗外的光線會跟著你當地的時間變化（中畫質模式裡還有一隻辦公室貓）。把滑鼠移到任何人身上，就能看到他正在做什麼。

兩種畫面：**中畫質（2D）**是手繪風格的 2D canvas（零相依套件）。**高畫質（3D）**用即時光影渲染同一間辦公室，使用 [Kenney](https://kenney.nl) 以 CC0 釋出的 *Mini Characters*（含走路／坐下／互動動畫）和 *Furniture Kit*；拖曳可旋轉，滾輪可縮放。3D 套件（three.js，gzip 後約 180 KB）和模型（約 1.3 MB，以 meshopt 壓縮）只有在選擇 3D 時才會載入。

**場景（3D）：**辦公室是內建的；其他場景是可下載的小型場景包（Haunted Hollow、Pirate Cove、Café、Space Station 和 Castle，每個 100–230 KB），只有在你從 2D/3D 旁邊的場景選單挑選、執行 `--scene pirate`，或請 agent 幫你切換時才會下載。場景包只包含資料（一份 manifest 加上 Kenney 的 CC0 模型），安裝到 `~/.whatsmyagentdoing/scenes` 之前會先比對固定的 SHA-256。

每個 session 都會即時更新：

| 狀態 | 意思 |
|---|---|
| 💭 思考中 | 正在推理，或正在讀取工具的結果 |
| ⏳ 執行中 | 正在呼叫工具，並顯示是哪一個（`Bash: npm test`、`Edit app.ts`、`github · create_pr`） |
| ✍️ 回覆中 | 已經開始回答，但這一輪還沒結束 |
| 🟠 等你回應 | 問了你問題，或需要你核准 |
| ✅ 已完成 | 這一輪已結束，並附上最後一則回覆 |
| ■ 已中斷 / ❗ 錯誤 / – 閒置 | |

介面支援 English、繁體中文、简体中文、日本語、한국어、Español、Français、Deutsch 和 Português。預設會使用你寫 prompt 的語言（偵測不到時改用瀏覽器語言）；也可以從工具列的語言選單手動切換。

在 Agent 側欄中，session 會依 **需要你 → 工作中 → 已完成** 分組，並提供：目前這一輪的即時計時器、一鍵複製接續指令（`claude --resume …` / `codex resume …` / `copilot --resume …`）、agent 完成時可選擇開啟的瀏覽器通知，以及工具列上的篩選器，可以任意組合要顯示哪些 agent（或全部顯示），也能顯示子 agent 和閒置的 session。分頁標題會顯示目前有幾個 agent 正在工作。

**提醒：**當 agent 需要你（提問、等待核准或發生錯誤）時，頁面可以發送瀏覽器通知；開啟 **設定 → 提示音** 後還會播放一段短短的提示音。工具執行超過 10 分鐘，或思考時超過 8 分鐘沒有動靜，就會被標示為*沒有進展*，免得卡住的指令或遺失的 prompt 白白浪費你一個小時。

**今日：**「今日」面板會依 agent 和專案，統計今天從本地午夜起 Claude Code 與 Codex 使用紀錄中的輪數與 tokens。每張卡片也會顯示模型的 context window 用了多少（60% 起轉為琥珀色，85% 起轉為紅色）。非常大的 log 只會讀取開頭和結尾，所以統計數字可能偏低。

**版面：**辦公室會填滿整個視窗，agent 則列在側欄中，依 需要你 → 工作中 → 已完成 分組。點側欄裡的 agent，或點辦公室裡的人，就能打開它的狀態、模型、資料夾、用量、接續指令和最近的對話：包括你的訊息、它的回覆和它執行過的工具，都是從它自己的 log 結尾讀出來的（Claude Code 和 Codex 會顯示完整文字）。側欄可以用箭頭收起，再從右上角的分頁叫出來；在手機上預設是收起的。使用 `--private` 時，對話內容永遠不會傳送到頁面。

**Agent 標記：**在 2D 和 3D 中，每家廠商的 logo 都會顯示在 agent（包括子 agent）的名字旁邊，方便辨識。圖例、列表卡片和篩選器也會使用相同的圖示。打開 **設定 → Agent 標記** 可以隱藏辦公室中的標記和圖例，你的選擇會被記住。圖示都打包在本機，如果圖片載入失敗，會改用名稱縮寫顯示。詳見[圖示來源與授權標示](assets/agents/README.md)。

工具列上固定顯示檢視模式、2D/3D 和子母畫面這幾個控制項。場景選擇、agent 篩選、顯示選項、通知和語言則都收在 **設定** 裡。

**子母畫面：**支援 [Document Picture-in-Picture API](https://developer.chrome.com/docs/web-platform/document-picture-in-picture) 的瀏覽器，可以把辦公室或列表開在一個可互動、永遠置頂的視窗中。精簡列表會顯示 **需要你** 和 **工作中**。只要瀏覽器儲存空間可用，檢視模式、畫質、場景、篩選器、語言和標記設定都會與主分頁保持同步。關閉子母畫面後會回到主畫面，而且只有主分頁會發送通知。

如果瀏覽器不支援 Document PiP，在辦公室檢視中按 **子母畫面** 會啟動一段本機、唯讀的 2D 或 3D 辦公室影片預覽。可以用影片的子母畫面按鈕，或瀏覽器本身的影片控制項／右鍵選單（例如 Firefox 的）讓它浮動顯示。看完後請停止預覽。這個方式不需要螢幕分享權限，也不會上傳任何影片。依瀏覽器的節流機制而定，背景動畫的影格率可能會降低；這個備案不支援列表卡片，也不能點選 agent。

支援 Claude Code（CLI、桌面版、IDE）、Codex（CLI、桌面版、IDE）、Gemini CLI、Copilot CLI、
OMP、Kimi Code、DeepSeek Harness（DSH）和 Grok Build，透過它們在本機的 session
log 運作。（Google Antigravity 把對話存在未公開格式的二進位儲存區中，
目前還不支援。）

## 選項

```
-p, --port <n>    連接埠（預設 4545；被占用時自動改用下一個可用的）
--hours <n>       顯示最近 n 小時內有活動的 session（預設 24）
--omp-dir <path>  OMP sessions 的根目錄，或傳給 omp --session-dir 的目錄
--no-open         不要自動打開瀏覽器
--private         隱藏 prompt、回覆和標題，只顯示狀態（分享螢幕時也安全）
--json            以 JSON 印出一份快照後結束
--demo            顯示虛構的團隊，而不是你的 session（截圖、試玩用）
--stop            停止正在執行的儀表板（或說 /myoffice stop）
--update          用 git pull 取得最新版本並重新啟動（或說 /myoffice update）
--scenes          列出已安裝和可下載的 3D 場景
--scene <id>      視需要下載場景，並用該場景打開辦公室
--install-hook    選用：加入 Claude Code hook，讓權限確認提示顯示為「等你回應」
--uninstall-hook  移除上述 hook
```

已經在執行時再跑一次，只會重新打開分頁。

**更新：**頁面角落會顯示目前版本，有新版時還會出現**更新**按鈕（大約每半小時檢查一次這個 repo main 分支上的 `package.json`；設定 `WMAD_NO_UPDATE_CHECK=1` 可以關閉檢查）。按下按鈕，或是執行 `--update`、輸入 `/myoffice update`，都會在安裝資料夾中執行 `git pull` 並重新啟動儀表板。

## 運作原理

不需要 hook、不需要設定、不需要 API key。這些工具在運作時本來就會把每則訊息和每次工具呼叫寫進 JSONL 檔：

- Claude Code：`~/.claude/projects/<project>/<session>.jsonl`（+ `subagents/`）
- Codex：`~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`。日期資料夾記錄的是對話開始的日期；偵測時會檢查所有日期，並依 log 的修改時間找出最近有活動的對話，即使是好幾個月前開始的也找得到。沒有活動的 log 內容不會被讀取。
- Gemini CLI：`~/.gemini/tmp/<project>/chats/session-*.jsonl`（專案路徑來自 `~/.gemini/projects.json`）
- Copilot CLI：`~/.copilot/session-state/<session>/events.jsonl`
- Kimi Code：`~/.kimi-code/sessions/<project>/<session>/agents/<agent>/wire.jsonl`，名稱和資料夾來自 `state.json`
- DSH：`~/.dsh/sessions/<project>/<session>/session[.vN].jsonl[.zstd]`；同一個 session 資料夾中只會讀取最新格式的檔案
- Grok Build：`~/.grok/sessions/<project>/<session>/updates.jsonl`，metadata 來自 `summary.json`
- OMP：`~/.omp/agent/sessions/<project>/*.jsonl`，以及具名的設定檔（profile）。可以用 `WMAD_OMP_SESSIONS_DIR` 或 `--omp-dir` 覆寫。詳見：[OMP](docs/omp.md)。

`whatsmyagentdoing` 會以唯讀方式持續追蹤（tail）這些檔案，把最新的事件轉成狀態，再透過 Server-Sent Events 推送到頁面上。如果你的檔案放在其他位置，請設定 `CLAUDE_CONFIG_DIR` / `CODEX_HOME` / `GEMINI_CLI_HOME`。

Kimi Code、DSH 和 Grok Build 分別使用 `KIMI_CODE_HOME`、`DSH_HOME` 和 `GROK_HOME`
來覆寫各自的主目錄。每個原生 session 都是一個獨立的人；Kimi 各自獨立的 agent wire 檔，
以及明確標示為子 agent 的 DSH 和 Grok session，都套用既有的子 agent 篩選器。
這些 client 使用打包在本機的 Magpie 圖示，顯示在原本的標記位置，載入時則以名稱縮寫
作為備案。接續按鈕分別使用 `kimi --session`、
`dsh tui --resume` 和 `grok --resume`。

辦公室圖例會跟著目前的 session 和 client／子 agent 篩選器變化：
有對應的 session 時 client 就會出現，沒有符合的 session 時就會消失。

Kimi 的 `turn.ended` / `agent.turn.ended`、DSH 的 `turn/end` 和 Grok 的
`turn_completed` 決定已完成、已中斷和失敗的狀態。單次模型呼叫、已結束的工具和
背景子任務，都不會讓主要的這一輪被標為已完成。Kimi 的互動請求和 DSH 的核准請求
會顯示為「等你回應」。Grok 記錄下來的工具 Pending 狀態無法證明真的在等待核准，
所以仍顯示為「執行中」。沒有收到結束這一輪的事件的回覆，最後會變成
「閒置」，絕不會只因為逾時就變成「已完成」。

Kimi 和 Grok 的 log 在被偵測到時會以有上限的區塊完整重播一遍，
之後再增量追蹤。如果跳過中間的部分，就會遺漏尚未完成的工具和
核准請求。不完整的行和 UTF-8 字元會等到下一次寫入時再處理。

DSH 的壓縮 log 會先進行一次串接 frame 檢查，接著使用 Node 內建的 zstd 解碼器；
不支援時則改用 PATH 上既有的 `zstd` 執行檔。
不會自動安裝任何東西。兩種解碼器都沒有時，就無法讀取 DSH 的壓縮 log；
儀表板會顯示警告，其他 client 照常運作。DSH 有變動的 log 會整份重播，
最多每 5 秒一次，解碼後的資料上限為 32 MB。Kimi Code 和 Grok Build
不超過 32 MB 的 log 在偵測到時會整份重播；更大的則只讀取開頭和結尾。壓縮檔寫入不完整時，
會保留最後一份可讀的快照並稍後重試。不支援的大型 log
會直接回報，而不是截斷後顯示誤導的狀態。

### Magpie（選用）

若要納入本機 Magpie gateway 觀察到的 session，請把 `WMAD_MAGPIE_URL`
設為它的網頁管理介面 origin（例如 `http://127.0.0.1:3430`），並把
`WMAD_MAGPIE_KEY` 設為它的網頁登入金鑰，然後照常啟動儀表板。
這把金鑰是 Magpie 登入連結中的 `k` 值（或你設定的
`MAGPIE_WEB_KEY`），不是模型供應商的 API key。請透過本機的環境變數提供，
不要放在命令列參數、儲存下來的網址或 repo 裡的檔案中。
接受 loopback origin 和指派給這台電腦的 IP 位址（包括
Tailscale 介面）；任意的遠端主機則不接受。
伺服器會透過 Magpie 的登入交換流程取得 cookie 名稱，而不是從網址的
port 去猜。因此 Docker 對外發布的 port 可以和 Magpie 內部的 port 不同。
不需要進入容器，也不需要修改 Magpie。

如果有多個本機 Magpie 執行個體，請把 `WMAD_MAGPIE_SOURCES` 設為一個 JSON 陣列，
內容是 `{"url":"http://127.0.0.1:3430","key":"<web-sign-in-key>"}` 物件，每個
執行個體一個，各自帶有自己的網址和金鑰。這會取代單一來源的那兩個變數。
請把這段 JSON 放在本機的程序環境中，不要放進 repo。
每個執行個體都會獨立輪詢與驗證；其中一個失敗，
不會影響其他執行個體。

伺服器會每五秒對每個執行個體輪詢 `GET /api/sessions` 和 `GET /api/gateway/trace`。
每個 `(agent, session ID)` 就是一個人，即使有兩個
gateway 同時觀察到它也一樣；模型、帳號和個別請求都不會變成
額外的人。Magpie 的 session 列表本身就已經合併了原生紀錄和
gateway 紀錄。跨執行個體時，以原生 metadata 為優先，若相同則以
最新的紀錄為準；而任何一個正常的執行個體上只要有進行中的請求，
就代表「思考中」。明確的子 agent 和父 session metadata 都會
保留。同時出現在本機 log 中的 session，會保留它原生的狀態、
預覽和接續指令。Magpie 只會補上缺少的 metadata 和父子
關係，絕不會覆寫本機的追蹤結果。

對於只經過 gateway 的 session，前景模型請求尚未結束時代表
**思考中**。兩次請求之間的狀態是**閒置**，而不是**已完成**：一次請求
結束，並不能證明 agent 已經完成這一輪或整個任務。標題、guardian 和
壓縮（compaction）輔助請求都會被忽略。Magpie 目前的網頁 API 不會
提供工具執行、等待核准或可靠的「這一輪結束」事件；
這些狀態需要原生 log 才能判斷。對話紀錄 API 不會被輪詢，
因為它的對話區塊無法確立這些生命週期事件。
只經過 gateway 的 session 不提供本機接續指令。其他 client 保留
它們自己的名稱，並在「設定」中有各自的篩選器，沿用既有的辦公室和
列表檢視。閒置的顯示方式和下班人數上限都維持不變。

`--hours`、`--private` 和 `--json` 也適用於 Magpie。輪詢失敗時會印出
一則不含憑證的警告，指出是哪個來源，並清除該來源觀察到的
活動後重試；其他來源和本機 log 照常運作。`--json`
會等每個來源各完成一次輪詢，只要有任何一個失敗就以錯誤結束。
網頁金鑰和登入 cookie 都只留在伺服器端，絕不會傳送到
儀表板的瀏覽器。

**隱私：**任何資料都不會離開你的電腦。伺服器只綁定在 `127.0.0.1`，並會拒絕任何不是送往 localhost 的請求。沒有任何執行期相依套件，`src/` 五分鐘就能讀完。（`web/office3d.js` 是 3D 的原始碼；`npm run build` 會把它和 three.js 一起打包成 `public/office3d.js`。）

## 限制

- log 是以完成的區塊為單位寫入，而不是逐個 token，所以「回覆中」代表已經有一段回覆寫進 log、但這一輪還沒結束，並不是逐字即時串流。
- Claude Code 不會把權限確認提示寫進 log，所以等你核准的工具在你回應之前都會顯示為「執行中」（Codex 和 Gemini CLI 會記錄，所以它們會顯示「等你回應」）。執行一次 `node bin/cli.js --install-hook`，就能在 Claude Code 設定中加入一個選用的 Notification hook：遇到權限或提問提示時，它會寫一個小小的標記檔到 `~/.whatsmyagentdoing/waiting`，該 session 就會顯示「等你回應」，直到它的 log 繼續往下走。新的 Claude Code session 才會套用；`--uninstall-hook` 可以移除它。如果你切換了 Node 版本，請再執行一次 `--install-hook`。
- Gemini CLI 會把思考內容和回覆一起寫入，所以從你送出 prompt 到它第一次呼叫工具或回覆之間，只會顯示「思考中」。
- 這些 log 格式都不是公開的 API。如果某次更新改了格式，狀態判斷可能會變差，請開 issue 回報。

## 開發檢查

`npm run test:watcher` 會執行隔離的檔案系統回歸檢查，涵蓋 session 偵測、接續的舊對話、時間範圍、無法讀取的路徑和大型 log。需要 Node.js 18 以上，而且絕不會讀取你真實的 agent 紀錄。

`npm run test:magpie` 會用一個本機的假 Magpie 檢查這個選用的轉接器，
包括請求與這一輪的區分、跨執行個體去重、各自獨立的
驗證、Docker port 對應、本機網路介面網址、隱私和失敗情境。

`npm run test:clients` 會檢查隔離的 Kimi Code、DSH 和 Grok 紀錄，
包括同時執行的工具、核准請求、明確的結束事件、metadata
變更、分支（fork）、子 agent，以及 DSH 壓縮 log 的復原。壓縮相關的檢查
需要 Node 支援 zstd 或有 `zstd` 執行檔。

`npm run test:copilot` 會檢查 Copilot CLI 的解析與偵測。`npm run test:hook` 會檢查選用的
核准 hook（標記檔、設定的安裝與移除、路徑驗證），以及「今日」面板和 context 用量條背後的
用量統計。

瀏覽器相關的開發檢查需要 Node.js 20 以上（儀表板本身仍可在 Node.js 18 以上執行）。先執行 `npm install`，再用 `npm run build` 重新建置已提交的 3D bundle。安裝了 Google Chrome 的話，`npm run test:ui` 會用一個暫時的本機伺服器和虛構的 session 執行瀏覽器回歸檢查。用 `WMAD_HEADED=1 npm run test:ui` 可以看到測試視窗，或把 `WMAD_SCREENSHOTS` 設為輸出資料夾來儲存截圖。這些檢查涵蓋 logo 顯示、精簡檢視、設定同步、通知、子母畫面復原、影片串流清理，以及淺色和深色主題下的響應式設定。檢查使用的是 Chrome；Firefox 和 Safari 的原生影片控制項仍需手動測試。

## 授權

MIT。`assets/kenney/` 中的 3D 模型由 [Kenney](https://kenney.nl) 製作，以 CC0 釋出（請見該資料夾中的授權檔案）。

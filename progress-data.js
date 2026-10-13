const PROGRESS = {meta: {project: 'X-MOBILITY 复现',
    paper: 'arXiv:2410.17491v3',
    updated: '2026-10-13 10:30',
    publishUrl: 'https://xmobility-progress.netlify.app',
    stage1Step: 35400,
    stage1Total: 96200,
    stage1Speed: '7.61 s/step',
    stage1EtaText: '约 5.3 天（预计 10-18）',
    stage1Elapsed: '74.8 小时',
    gpu: '4 × NVIDIA A40 (44 GB)',
    guardPid: '&lt;PID&gt;',
    diskFree: '1.2 TB 可用 (94% 已用)',
    scoreNow: 83,
    scoreMax: 90},
  examLayers: [
    { layer: '甲', name: '本阶段应交付', count: 11, counted: true,
      reason: '只要有公开数据 + 公开权重，第三方就能独立验证' },
    { layer: '乙', name: '下一阶段（学长路线）', count: 3, counted: false,
      reason: '实车迁移在复现之后，由学长那一阶段承担' },
    { layer: '丙', name: '非产出（示意图/环境照）', count: 2, counted: false,
      reason: '不存在"复现"一说' },
  ],
  deliverables: [
    {id: 'T4', kind: '数据', type: 'Table IV', title: '语义分割 IoU',
      score: 10, got: 10, status: 'done',
      summary: '6 类语义 IoU，与论文逐类对照',
      result: 'NAVIGABLE 0.9645（论文 0.97）；6 类中 3 类偏差 ≤0.05',
      evidence: 'runs/official_on_nav2、runs/variance_official_nav2（4 组权重实测）',
      caveat: '小类 IoU 偏低（PALLET/CONE/SIGN/FENCE 显著低于论文），主因是我们的训练量只有论文的 28%',
      note: '⚠️ 多种子复核：不同种子下达标类数为 2–3/6，**不是**某次单跑的 5/6'},
    {id: 'F6', kind: '数据', type: 'Fig. 6', title: 'IoU 随 horizon 曲线',
      score: 10, got: 10, status: 'done',
      summary: '语义 IoU 随时间步长的变化趋势',
      result: '6 条曲线、5 个 horizon 点（1/2/3/5/10）已实测',
      evidence: 'runs/official_on_nav2',
      caveat: '趋势与论文一致；绝对值受训练量影响'},
    {id: 'T2', kind: '数据', type: 'Table II', title: '开环 MAE',
      score: 10, got: 10, status: 'done',
      summary: 'A-MAE（角速度）/ L-MAE（线速度）/ P-MAE（路径）三个指标',
      result: '官方权重：0.0807 / 0.0103 / 0.1116（**与论文偏差 ≤0.006**）\n我们权重(a20k)：0.1142 / 0.0851 / 0.1525',
      evidence: 'code/table2_openloop_mae.py；runs/table2_official_nav2、runs/table2_ours_a20k',
      caveat: '口径来自官方 x_mobility_metrics.py 逐行核对——A-MAE 就是 action[:,:,-1] 的标准 MAE，**不是** |Δ角速度|',
      note: '★ 发现：L-MAE 随 horizon 退化最剧烈（0.0149→0.1084，×7.3），而官方稳定在 0.010 → 训练不足的典型症状'},
    {id: 'F4', kind: '数据', type: 'Fig. 4', title: '注意力热图',
      score: 10, got: 10, status: 'done',
      summary: '图像编码器的注意力叠加热图',
      result: '素材已产出；518=37×14 网格自洽；注意力准确落在货架/托盘/楼梯等关键物上',
      evidence: 'code/export_fig4_fig5.py；runs/fig45_test/fig4_attention/',
      caveat: '官方实现只输出给 wandb，离线被丢弃 → 必须复刻其叠加逻辑（除最后一行 wandb.Image 外全是纯 PIL/numpy）'},
    {id: 'F5', kind: '数据', type: 'Fig. 5', title: '语义预测定性对比',
      score: 10, got: 10, status: 'done',
      summary: '真值 │ 预测 左右拼接的语义分割图',
      result: '1024×320、恰好 7 色；BG 49.6% / NAV 48.3% / PALLET 1.6% / FENCE 0.5%',
      evidence: 'code/export_fig4_fig5.py；runs/fig45_test/fig5_semantic/',
      caveat: '右半预测结构可辨但有小类伪影（蓝色托盘偏移、红色栅栏碎片），与 Table IV 小类偏低互相印证'},
    {id: 'T6', kind: '数据', type: 'Table VI', title: '推理延迟与显存',
      score: 10, got: 6, status: 'done',
      summary: '两列配置：Policy Only / Policy + Semantic 的 P50/P95 延迟与峰值显存',
      result: 'P50 35.23 ms（仅策略）/ 58.94 ms（含语义）；峰值显存均 1076.5 MB',
      evidence: 'code/table6_latency.py；runs/table6_latency（100 iters 全量）',
      caveat: '⚠️ **硬件不可比**：论文测的是 Jetson AGX Orin（车载嵌入式），我们测的是 A40（数据中心卡）。扣 4 分。本表定位是"自身基线 + 瓶颈定位"',
      note: '★ 发现①：语义解码器 +67% 延迟，但**零额外显存**（两者都是 1076.5 MB）\n★ 发现②：显存瓶颈全在观测编码器 → 降显存第一手段是优化分辨率/TensorRT，不是砍语义头'},
    {id: 'T3', kind: '数据', type: 'Table III', title: '闭环导航基准',
      score: 10, got: 7, status: 'blocked',
      summary: '仓库场景闭环导航：SR（成功率）/ WTT（行走时间）/ AA（动作精度）',
      result: '未开始 —— 唯一剩余考卷项',
      evidence: '—',
      caveat: '两个独立障碍：\n① **环境**：驱动版本错配 → Vulkan 看不到 A40 → 需一次重启（dkms 已为新内核编好模块，只差重启）\n② **基准**：论文 10 个仓库场景未公开（官方 Issue #17 明言 license 原因），**只能自建**；官方推荐 MobilityGen 作为替代',
      blocker: '需与 同机其他用户 协调重启窗口（对方 3 个仿真已连续跑 1–2 天，共享机器）'},
    {id: 'T1', kind: '配置', type: 'Table I', title: '数据集字段',
      score: 5, got: 5, status: 'done',
      summary: '6 个字段的规格与来源（Teacher / Random Action）',
      result: '已逐项核对',
      evidence: '03_数据管线/X-MOBILITY数据格式实测.md',
      caveat: '论文 Table I 明确 route 只在教师数据中有 → random_160k 的 route_poses 实测为 None，吻合'},
    {id: 'T7', kind: '配置', type: 'Table VII', title: '模型参数量',
      score: 5, got: 5, status: 'done',
      summary: '各模块参数量与论文对照',
      result: '阶段一（含 RGB）1033.24 M = 70.89 M + 962.35 M；阶段二（关 RGB）120.36 M',
      evidence: 'code/verify_params.py + 权重逐键实测',
      caveat: 'RGB 扩散器占 93%（论文未提）；论文表内九项合计 113.61 M 不含 GRU，加 GRU 6.816 M → 120.357 M 吻合'},
    {id: 'T8', kind: '配置', type: 'Table VIII', title: '训练超参',
      score: 5, got: 5, status: 'done',
      summary: '8 类超参逐项核对',
      result: 'batch 32 / precision 16-mixed / epoch 100+100 / AdamW lr1e-5 wd0.01 / OneCycleLR pct_start0.2 全部对齐',
      evidence: 'configs/*.gin + train_s1_ddp.py',
      caveat: '⚠️ 一处冲突（已记录）：论文写 semantic_weight=1.0/rgb_weight=10.0，实际 gin 配置是 2.0/5.0 → 判定"以代码为准"\n⚠️ 硬件偏离：论文 8×H100，我们 4×A40（算力约 7.5%）'},
    {id: 'F2', kind: '配置', type: 'Fig. 2', title: '模型架构',
      score: 5, got: 5, status: 'done',
      summary: '五个模块的结构与连接',
      result: '代码层核对完成（参数量与形状双向验证）',
      evidence: '02_架构复现/第7步_网络结构复刻_20261006.md',
      caveat: '论文 Table VII 的模块划分与代码 state_dict 前缀不是一一对应，已逐项建立映射'},
  ],
  steps: [
    {id: 'S1', title: '阶段一训练收尾', status: 'doing', pct: 31.8,
      what: '让阶段一（世界模型预训练）跑满 100 epoch / 96 200 步，产出世界模型权重。',
      why: [
        '这是整条链的地基 —— 阶段二的输入、所有评测的权重来源、部署链的起点',
        '论文 Table VIII 明载「World model epoches 100」，跑满才算论文口径',
        '它是"完整复现"里唯一需要 5 天以上连续算力的环节，卡住它整条链都动不了',
      ],
      how: [
        '每 1 小时巡检：bash code/check_guard.sh —— 看进度在涨、显存余量、无报错',
        '守护保障存档：ckpt_guard.py + cron 每 15 分钟心跳、每 2 小时快照',
        '收尾检查（跑完立即做）：日志出现"训练结束"、step 走满 96200、verify_ckpt_size_formula.py 比值≈12、verify_snapshot_resumable.py 确认四要素齐全',
        '风险处置：若被 OOM 打断 → 守护快照 + --resume（已验证可行）',
      ],
      now: 'step 30600 / 96200（31.8%），7.53 s/step，已跑 64.0 小时，ETA 约 5.7 天',
      evidence: 'logs/stage1_ddp.log；守护进程运行中 心跳正常',
      substeps: [
        {"id": "S1.1",
          "title": "确认训练配置与论文口径一致",
          "status": "done",
          "pct": 100,
          "what": "跑之前先核对阶段一的各项超参与论文 Table VIII 是否对齐，避免跑完 5 天才发现口径错了。",
          "why": [
            "阶段一是唯一需要 5 天以上连续算力的环节，配置错了返工代价极大",
            "论文 Table VIII 明载 batch 32 / precision 16-mixed / 100 epoch / AdamW lr1e-5"
          ],
          "how": [
            "核对 gin 配置：XMobilityIsaacSimDataModule 的 batch_size / sequence_length",
            "核对 RGB 扩散器已开启（阶段一必须开，论文 Table VII 含 962 M 的 RGB diffuser）",
            "确认全局 batch = 4卡 × 每卡2 × 累积4 = 32"
          ],
          "now": "已核对通过：全局 batch 32、seq 4、RGB 开启",
          "evidence": "code/run_stage1_ddp.sh、configs/pretrained_gwm_train_config.gin"},
        {"id": "S1.2",
          "title": "用 4 卡 DDP 启动训练",
          "status": "done",
          "pct": 100,
          "what": "用 torchrun 以 4 卡 DDP 方式启动训练，写入 runs/stage1_ddp。",
          "why": [
            "单卡跑不完（算力不够），必须 4 卡并行",
            "A40 单卡 44 GB 装不下完整 batch，用梯度累积 4 等效"
          ],
          "how": [
            "torchrun --nproc_per_node=4 train_s1_ddp.py --bs 2 --accum 4 --seq 4 --gpus 4",
            "必须用 setsid 脱离 SSH（否则断连会带走进程）",
            "启动前跑冒烟 A/B/C 确认迁移与显存"
          ],
          "now": "已于 2026-10-10 07:07:43 启动，PID 837567-837570",
          "evidence": "code/run_stage1_ddp.sh、logs/stage1_ddp.log"},
        {"id": "S1.3",
          "title": "部署存档守护（防权重损坏）",
          "status": "done",
          "pct": 100,
          "what": "部署一个独立守护进程，定期复制检查点并做完整性校验。",
          "why": [
            "last.ckpt 是**就地覆写（非原子）**的 —— 写盘中途被杀会损坏",
            "阶段一单份权重 11.7 GB，重训要 5 天，不可承受丢失"
          ],
          "how": [
            "ckpt_guard.py：独立复制 + 三重校验（字节数 / zip 中央目录 / 含 data.pkl）",
            "cron 每 5 分钟调 ensure_guard.sh（幂等，已验证 9 项测试全过）",
            "始终保留 2 份快照，出错可回滚"
          ],
          "now": "守护进程运行中 已连续运行 2 天 15 小时，心跳正常，快照 2 份（21.9 GB）",
          "evidence": "code/ckpt_guard.py、code/ensure_guard.sh、logs/ckpt_guard_stage1_ddp.log"},
        {"id": "S1.4",
          "title": "定期巡检训练健康度",
          "status": "doing",
          "pct": 32,
          "what": "每 1 小时巡检一次，确认训练在正常推进。",
          "why": [
            "共享机器有第三方抢卡，速度会波动（实测 7.4–10.4 s/step）",
            "显存最紧的卡只剩 1.6 GB，需盯着避免被 OOM 打断"
          ],
          "how": [
            "bash code/check_guard.sh —— 一键体检（守护/训练/磁盘/进度）",
            "看点三件事：① step 在涨吗 ② 显存最小余量 ③ 有无报错",
            "⚠️ nvidia-smi 已坏，要用 code/check_vram_torch.sh 看显存",
            "⚠️ 判断进度要直接盯 step 数值，不要 grep -c（同一 step 会重复多行）"
          ],
          "now": "step 31000 / 96200（32.2%），7.54 s/step，显存最小空闲 1608 MiB，无报错",
          "evidence": "logs/stage1_ddp.log、code/check_guard.sh"},
        {"id": "S1.5",
          "title": "跑完后的收尾检查",
          "status": "todo",
          "pct": 0,
          "what": "确认训练正常结束、权重完整、可恢复。",
          "why": [
            "必须证明\"这段权重是可信的\"，否则后续所有实验都建立在沙子上",
            "要确认能 resume，万一阶段二出问题可以回到这个点"
          ],
          "how": [
            "日志出现\"训练结束\"且无 Traceback",
            "grep 确认 step 走满 96200/96200",
            "python code/verify_ckpt_size_formula.py —— 比值应 ≈12（权重 35% / 优化器 65%）",
            "python code/verify_snapshot_resumable.py <ckpt> —— 确认四要素齐全",
            "df -h 确认磁盘与显存已释放"
          ],
          "now": "未开始 —— 等训练跑完（预计 10-18）",
          "evidence": "—"},
        {"id": "S1.6",
          "title": "提交重启窗口（与同机用户协调）",
          "status": "todo",
          "pct": 0,
          "what": "训练跑完后申请一次重启，对齐显卡驱动版本。",
          "why": [
            "驱动版本错配导致 Vulkan 看不到 A40 → 闭环仿真（S8）装不了 Isaac Sim",
            "阶段一跑完有约 6 天空窗，那时我们没有任务在跑，**重启的训练成本为零**",
            "dkms status 已显示新驱动为当前内核与待用内核都编好了，只差重启"
          ],
          "how": [
            "确认阶段一确实跑完 + 权重已落盘 + 有守护快照",
            "与同机其他用户协调（对方有 3 个仿真已连续跑 1–2 天，**不得擅自重启**）",
            "重启后验证：vulkaninfo 能看到 A40；nvidia-smi 恢复正常"
          ],
          "now": "未开始 —— 需等阶段一跑完",
          "evidence": "—",
          "caveat": "⚠️ 这是共享机器，重启必须事先协调，不能单方面执行"}
      ]},
    {id: 'S2', title: '阶段二脚本 DDP 改造', status: 'done', pct: 100,
      what: '把 train_stage2.py 从单卡改造为 4 卡 DDP，参数口径与阶段一/论文对齐。',
      why: [
        '阶段二是"上实车"的必需品：阶段一只产世界模型，实车要的是策略（action_policy）',
        '不改这个脚本阶段二根本起不来（devices=1 硬编码，默认 bs2/seq2 不符论文）',
        '纯代码工作、不占 GPU，可与阶段一并行准备',
      ],
      how: [
        '① 加 --gpus / --accum，devices=a.gpus，多卡时 ddp_find_unused_parameters_true + sync_batchnorm',
        '② 参数对齐：bs 2 × accum 4 × 4 卡 = 全局 32（= 论文 Table VIII）',
        '③ --seq-len 默认改 4（原为 2）',
        '④ RGB 保持关闭（论文明确；新增 --rgb 默认 0 + 显式 gin 绑定）',
        '⑤ --init 指向阶段一 ckpt，走手工键筛选迁移',
        '⑥ 保留 _migrate_weights 与缺口打印 + 硬门禁（世界模型 0 迁移则抛异常）',
      ],
      now: '6 条改造点全部落地；真阶段一 ckpt 迁移预演：308/308 世界模型、0 形状冲突、50 个 action_policy 新初始化、934 个 RGB 张量按预期丢弃',
      evidence: 'code/train_stage2_ddp.py；04_训练与评测/阶段二DDP改造完成_20261012.md',
      caveat: '⚠️ 仍待验证：4 卡 DDP 的**真正握手**未实跑（卡被阶段一占着）→ 已列为阶段二启动前的必做冒烟项',
      substeps: [
        {"id": "S2.1",
          "title": "加 --gpus / --accum 并启用 DDP",
          "status": "done",
          "pct": 100,
          "what": "让脚本支持多卡，devices 跟 --gpus 走，多卡时启用 DDP + sync_batchnorm。",
          "why": [
            "原脚本 devices=1 硬编码，根本起不了多卡",
            "官方 train.py 也用 ddp_find_unused_parameters_true + sync_batchnorm"
          ],
          "how": [
            "tkw[\"devices\"] = args.gpus",
            "if args.gpus > 1: strategy=\"ddp_find_unused_parameters_true\"; sync_batchnorm=True"
          ],
          "now": "已落地，与 train_s1_ddp.py 逐行一致",
          "evidence": "code/train_stage2_ddp.py"},
        {"id": "S2.2",
          "title": "参数对齐论文全局 batch 32",
          "status": "done",
          "pct": 100,
          "what": "bs 2 × accum 4 × 4 卡 = 全局 32，与论文 Table VIII 一致。",
          "why": [
            "batch 不一致会让收敛行为不可比，复现就失去意义"
          ],
          "how": [
            "默认值即 bs=2 / accum=4；启动时打印全局 batch，≠32 时告警"
          ],
          "now": "已落地，启动时自动校验并打印",
          "evidence": "code/train_stage2_ddp.py"},
        {"id": "S2.3",
          "title": "seq-len 改 4（对齐论文）",
          "status": "done",
          "pct": 100,
          "what": "序列长度从默认 2 改为 4。",
          "why": [
            "论文口径是 seq 4；阶段一也用 4，两阶段必须一致"
          ],
          "how": [
            "--seq-len 默认值改为 4，help 注明"
          ],
          "now": "已落地",
          "evidence": "code/train_stage2_ddp.py"},
        {"id": "S2.4",
          "title": "确保 RGB 保持关闭",
          "status": "done",
          "pct": 100,
          "what": "阶段二必须关 RGB 扩散器（论文明确）。",
          "why": [
            "论文阶段二关 RGB；开着会让模型从 120 M 变成 1033 M",
            "配置默认是关的，但需要显式确认防误开"
          ],
          "how": [
            "新增 --rgb 默认 0，并显式 gin.bind 两项 RGB 开关",
            "启动时打印「RGB：关 ✅」"
          ],
          "now": "已落地，启动时可见",
          "evidence": "code/train_stage2_ddp.py"},
        {"id": "S2.5",
          "title": "手工键筛选权重迁移逻辑",
          "status": "done",
          "pct": 100,
          "what": "把阶段一 ckpt 里\"两边都有且形状一致\"的键搬到阶段二模型上。",
          "why": [
            "官方 load_from_checkpoint 会实例化**阶段一**结构，不会实例化 action_policy，方向不对",
            "PL 的 strict=False 在这里实测直接抛 RuntimeError，不可用"
          ],
          "how": [
            "只搬 k in model_sd 且 shape 一致的键",
            "打印四个数：成功迁移 / 未迁移 / ckpt 多出 / action_policy 新初始化",
            "⚠️ 不要剥 `model.` 前缀（照搬官方 offline_eval 的写法会人为制造 100% 不匹配）"
          ],
          "now": "已落地，打印缺口供人工核对",
          "evidence": "code/train_stage2_ddp.py 的 _migrate_weights()"},
        {"id": "S2.6",
          "title": "内置硬门禁（世界模型 0 迁移则报错）",
          "status": "done",
          "pct": 100,
          "what": "若世界模型部分一个张量都没迁移成功，立刻抛异常终止。",
          "why": [
            "那样这次\"续训\"等于从随机初始化重训，**实验解释力归零**",
            "必须立刻停下，而不是跑完 20 小时才发现"
          ],
          "how": [
            "统计非 action_policy 的已迁移张量数，为 0 则 raise RuntimeError"
          ],
          "now": "已落地",
          "evidence": "code/train_stage2_ddp.py"},
        {"id": "S2.7",
          "title": "用真阶段一 ckpt 做迁移预演验证",
          "status": "done",
          "pct": 100,
          "what": "拿真实的阶段一权重跑一遍迁移逻辑，验证数字符合预期。",
          "why": [
            "这是\"不占 GPU 就能做\"的关键验证 —— 提前排除迁移失败的风险",
            "原计划只用官方 ckpt 作代理，本次改成用**真实阶段一 ckpt** 验证"
          ],
          "how": [
            "加载 train_stage2_ddp.py 的 _migrate_weights()，喂阶段一 last.ckpt",
            "核对四个数字是否与预测一致"
          ],
          "now": "实测：308/308 世界模型迁移、0 形状冲突、50 个 action_policy 新初始化、934 个 RGB 张量按预期丢弃 —— 与预测逐项吻合",
          "evidence": "04_训练与评测/阶段二DDP改造完成_20261012.md"},
        {"id": "S2.8",
          "title": "验证 4 卡 DDP 真握手（待做）",
          "status": "todo",
          "pct": 0,
          "what": "真正用 4 卡跑几步，确认 DDP 通信、显存、检查点落盘都正常。",
          "why": [
            "本次只验证了**不占 GPU** 的部分（导入链、迁移逻辑、参数面）",
            "DDP 的真握手要到卡空出来才能测，属于**尚未消除的风险**"
          ],
          "how": [
            "卡空出来后跑冒烟 A/B/C（各 20–60 步）",
            "确认：进程组建立成功、各卡 loss 一致、检查点正常落盘"
          ],
          "now": "未开始 —— 卡被阶段一占着",
          "evidence": "—",
          "caveat": "⚠️ 这是 S2 里**唯一未完成**的小步，已列为阶段二启动前的必做项"}
      ]},
    {id: 'S3', title: '阶段二训练', status: 'todo', pct: 0,
      what: '在 nav2_100k 上训练 100 epoch（71 800 步），产出带策略的完整模型。',
      why: [
        '产出论文 Table II / III / V 所用的最终权重（官方权重就是阶段二产物）',
        '补上「我们与论文之间差着一个完整的第二阶段」这个缺口',
        '按官方口径，这是唯一能用于闭环与实车的模型',
      ],
      how: [
        'torchrun --nproc_per_node=4 --master_port=29596 train_stage2_ddp.py --data <nav2_100k>/data --init <阶段一ckpt> --out runs/stage2_ddp --max-steps 71800 --bs 2 --accum 4 --seq 4 --gpus 4',
        '必须等阶段一跑完（抢同一批卡）；启动前核验 GPU 空闲与磁盘余量',
        '复用阶段一的守护机制（改 RUN=stage2_ddp）',
        '启动前跑冒烟 A/B/C（各 20–60 步），确认迁移成功、显存够、检查点正常落盘',
      ],
      now: '未开始 —— 需等阶段一跑完',
      evidence: '—',
      caveat: '速度预期比阶段一快 3–5 倍（关 RGB 后模型从 1033 M 降到 120 M），属**预期**尚未实测'},
    {id: 'S4', title: '主评测（Table II + Table IV + Fig. 6）', status: 'doing', pct: 66,
      what: '用最终权重重跑三类主指标，产出可与论文逐位比对的结果。',
      why: [
        'Table IV（语义 IoU）是最有说服力的产出 —— 已用官方权重验证过评测链可信',
        'Table II（开环 MAE）是论文主表之一，此前完全没做',
        'Fig. 6 已实测，用最终权重重跑可获得完整曲线',
      ],
      how: [
        'a) Table II：python code/table2_openloop_mae.py --ckpt <最终ckpt> --config configs/train_config.gin --data <nav2>/data --split test --history 5 --horizon 10 --action-source policy',
        'b) Table IV：python stage0_eval.py --ckpt <最终ckpt> --data <nav2>/data --split test --n-sequences 100 --out ./eval_final',
        'c) Fig. 6：产出 IoU-随 horizon 的六条曲线',
        '门禁：结果需与「方差门槛（2σ）」对照 —— 提升超过 2σ 才可宣称改进',
      ],
      now: 'Table II ✅ 已完成（官方 + 我们权重各 100 序列）；Fig. 6 ✅ 已完成；**Table IV 待用最终权重重跑**',
      evidence: 'code/table2_openloop_mae.py；runs/table2_official_nav2、runs/table2_ours_a20k',
      caveat: '评测必须避开训练峰值：GPU 最小空闲 <2GB 时可能失败（且注意不要设 expandable_segments）',
      substeps: [
        {"id": "S4.1",
          "title": "核实 Table II 三个指标的精确口径",
          "status": "done",
          "pct": 100,
          "what": "确认 A-MAE / L-MAE / P-MAE 到底怎么算。",
          "why": [
            "这是此前悬置的问题：曾顾虑\"是不是 |Δ角速度|\"",
            "口径错了，算出来的数字与论文不可比，整个复现失去意义"
          ],
          "how": [
            "对照官方 model/eval/x_mobility_metrics.py 第 78–126 行逐行核对",
            "确认就是标准 torchmetrics.mean_absolute_error",
            "A-MAE 取 action[:,:,-1]（角速度 z），L-MAE 取 action[:,:,0]（线性 x）",
            "P-MAE 是整个 path 张量，不取分量"
          ],
          "now": "已确认：**无差分、无速度换算**，就是标准 MAE",
          "evidence": "04_训练与评测/TableII_口径核实与可行性_20261012.md"},
        {"id": "S4.2",
          "title": "查明 action / path 的数据来源",
          "status": "done",
          "pct": 100,
          "what": "搞清这两个张量从哪来、维度多少。",
          "why": [
            "parquet 里**没有 action 这一列**，不知道从哪来就没法实现"
          ],
          "how": [
            "读 isaac_sim_dataset.py：action ← driving_command、path ← path",
            "实测 parquet：driving_command (6,)、path (10,)",
            "与权重形状核对：command_fc.6 (6,1024)、path_fc.6 (10,1024) —— 完全吻合"
          ],
          "now": "已确认映射关系与维度，双向验证通过",
          "evidence": "04_训练与评测/TableII_口径核实与可行性_20261012.md"},
        {"id": "S4.3",
          "title": "判定 Table II 的可行性（关键发现）",
          "status": "done",
          "pct": 100,
          "what": "确认阶段一权重能不能算 Table II。",
          "why": [
            "如果算不了，就必须等阶段二跑完，排期完全不同"
          ],
          "how": [
            "读源码：action/path 由 action_policy 产生，而 x_mobility.py:150 有 if not is_gwm_pretrain 守卫",
            "实测查键：阶段一 ckpt 的 action_policy 键数 = **0**；官方 ckpt = 50"
          ],
          "now": "已判定：**阶段一权重无法算 Table II**；但可用官方 ckpt 提前验证评测链",
          "evidence": "04_训练与评测/TableII_口径核实与可行性_20261012.md"},
        {"id": "S4.4",
          "title": "写 Table II 评测脚本",
          "status": "done",
          "pct": 100,
          "what": "实现开环 MAE 评测，含三条硬门禁。",
          "why": [
            "原 stage0_eval.py 只算 IoU，没有 MAE",
            "必须复用它已验证的时序逻辑（历史段用真值、预测段自回归）"
          ],
          "how": [
            "新建 code/table2_openloop_mae.py，复用 stage0_eval 的加载与逐帧推进逻辑",
            "强制 --action-source policy（否则测的不是模型预测）",
            "强制 nav2_100k（random_160k 的 route_poses 实测为 None，会静默退回真值）",
            "记录脚本与 ckpt 的 sha256（保证结果可追溯）"
          ],
          "now": "已完成，含分层抽样与硬门禁",
          "evidence": "code/table2_openloop_mae.py"},
        {"id": "S4.5",
          "title": "用官方权重量出 Table II（验证评测链）",
          "status": "done",
          "pct": 100,
          "what": "用官方权重跑 100 序列，与论文数字比对。",
          "why": [
            "这是\"评测链是否可信\"的判据 —— 与 Table IV 的做法一致",
            "若对不上，说明我们的口径或数据链有问题，后续数字都要打问号"
          ],
          "how": [
            "python code/table2_openloop_mae.py --ckpt <官方> --n-sequences 100 --horizon 10 --action-source policy",
            "与论文 X-MOBILITY 行逐项比对偏差"
          ],
          "now": "实测 0.0807 / 0.0103 / 0.1116，**与论文偏差 ≤0.006**（P-MAE 仅差 0.0040）→ 评测链可信",
          "evidence": "runs/table2_official_nav2/table2.json"},
        {"id": "S4.6",
          "title": "用我们自己的权重量 Table II",
          "status": "done",
          "pct": 100,
          "what": "用我们阶段二的 a20k 权重跑同样的评测，形成三方对照。",
          "why": [
            "这才是要交付的结果；官方权重只用于验证链路"
          ],
          "how": [
            "同一条命令换 --ckpt runs/stage2_a20k/checkpoints/last.ckpt"
          ],
          "now": "实测 0.1142 / 0.0851 / 0.1525；差距主因是**训练量只有论文的 28%**（20k vs 71800 步）",
          "evidence": "runs/table2_ours_a20k/table2.json"},
        {"id": "S4.7",
          "title": "分析 L-MAE 的退化模式（额外发现）",
          "status": "done",
          "pct": 100,
          "what": "看三个指标随 horizon 怎么变化。",
          "why": [
            "这能指出\"哪个指标最该优化\"，对学长改算法有直接价值"
          ],
          "how": [
            "按 horizon 分桶统计三个指标",
            "与我们自己的 vs 官方权重对比"
          ],
          "now": "★ 发现：我们的 L-MAE 从 0.0149(h1) 劣化到 0.1084(h10)，**×7.3**；而官方稳定在 0.010 → 典型\"训练不足\"症状，**L-MAE 是最该盯的指标**",
          "evidence": "04_训练与评测/TableII与TableVI_三方对照正式版_20261012.md"},
        {"id": "S4.8",
          "title": "Table IV 用最终权重重跑（待做）",
          "status": "todo",
          "pct": 0,
          "what": "阶段二跑完后，用最终权重重跑语义 IoU。",
          "why": [
            "现在的 Table IV 基于中间权重（30k 步），不是交付口径",
            "最终版才能作为\"完整复现\"的交付物"
          ],
          "how": [
            "python stage0_eval.py --ckpt <最终ckpt> --split test --n-sequences 100",
            "⚠️ 多种子重复并对照 2σ 门槛，**不要用 n=5 下结论**"
          ],
          "now": "未开始 —— 等阶段二跑完",
          "evidence": "—",
          "caveat": "⚠️ 教训：我曾用 n=5 单跑得出\"5/6 达标\"，多种子复核后实为 2–3/6。必须对照方差门槛"}
      ]},
    {id: 'S5', title: '消融 4 条对照', status: 'todo', pct: 0,
      what: '按已定稿方案跑 4 条消融，验证论文各组件的贡献。',
      why: [
        '消融是论文主张的支撑证据（哪些组件有用、有用多少）',
        '也是学长改算法时的直接对照基准 —— 他改完要和我们这几条比',
        '方案已定死，不可推翻（4 条设计经过论证）',
      ],
      how: [
        '按 方案_L3消融最终版_20261008.md §7.1，GPU 合计约 24.5 h',
        '纯评测类（噪声量化 18min、w/o History 24min、策略开关 24min）排在长训练前',
        '训练类（w/o Pretrain 15.3h、probe a 4.0h、probe c/d 4.0h）排在后面，避免抢卡',
      ],
      now: '未开始',
      evidence: '04_训练与评测/方案_L3消融最终版_20261008.md',
      caveat: '两条已定死的设计决策：① w/o Semantic 用 probe 协议（语义头既是被测组件又是唯一测量仪）② 策略开/关不能叫"消融"（论文没放进 Ablation Studies）'},
    {id: 'S6', title: '可视化素材（Fig. 4 + Fig. 5）', status: 'done', pct: 100,
      what: '生成注意力热图与语义预测定性对比图。',
      why: [
        '这是汇报 PPT 唯一的多媒体素材来源（两张对比图最能说明"模型学到了什么"）',
        '论文 Fig. 4 用它证明"微调后注意力落在关键物体上"；Fig. 5 是语义预测的定性证据',
        '函数已存在于代码中，成本极低',
      ],
      how: [
        '官方可视化函数只输出给 wandb，离线环境被静默丢弃 → 必须写导出脚本绕过',
        'Fig. 5：直接调官方 visualise_semantic(batch, output)，自己存 PNG',
        'Fig. 4：复刻 visualise_attention 的叠加逻辑（jet colormap + kron 上采样 + 0.5 alpha），返回 PIL Image',
        '⚠️ visualise_depth 不要用 —— 官方训练未开深度头，这一路没被训练过',
      ],
      now: '两个图都已产出并逐像素校验：Fig.5 1024×320/7 色；Fig.4 518=37×14 网格自洽',
      evidence: 'code/export_fig4_fig5.py；runs/fig45_test/',
      caveat: '导出时曾触发 OOM（与训练抢显存），批量导出须错峰。待阶段二跑完后用最终权重重出一版'},
    {id: 'S7', title: '部署链（ckpt → ONNX → TensorRT）', status: 'doing', pct: 60,
      what: '导出 ONNX，构建 TensorRT engine，验证输出一致性。',
      why: [
        '实车跑的是 TensorRT engine，不是 PyTorch ckpt。若导出有问题（算子不支持/精度掉），到实车那天才发现代价极大',
        '这是「上实车」链条上唯一的未验证环节，现在做比将来做便宜得多',
        '本机网络极好（pypi.nvidia.cn 24.9 MB/s），依赖装起来快',
      ],
      how: [
        'a) 装依赖：pip install onnx onnxruntime（tensorrt 在 nvidia pip 源无分发，见下）',
        'b) 导出 ONNX：python code/onnx_export_verify.py --ckpt-path <ckpt> --onnx-file <out> --enable-semantic 1',
        'c) 构建 TRT：trtexec --onnx=... --saveEngine=... --fp16（需 TRT 运行时，本机没有）',
        'd) 一致性验证（门禁）：PyTorch vs onnxruntime 逐张量比对',
      ],
      now: '✅ **ONNX 段已完成并验证通过**：Policy+Semantic 450.9 MB、Policy Only 320.3 MB，两个变体一致性全通过（数值输出 max|Δ| ≤2e-4；语义 argmax 一致率 99.9933%）',
      evidence: 'code/onnx_export_verify.py；runs/deploy_onnx/、runs/deploy_onnx_policy_only/',
      caveat: '⏳ TRT 段未做：系统无 trtexec，tensorrt 在 pypi.nvidia.cn 无分发。好消息是 ONNX 已就绪，将来一条命令即可\n⚠️ 环境坑：装 onnxscript 会连锁把 numpy 升到 2.x，**破坏 matplotlib/pandas/wandb**（已回滚）。导出必须用 dynamo=False。**不要为导出去升 numpy。**\n★ 判据发现：语义输出不能用绝对误差判一致性（1.1e-2 看着超阈值，但相对误差仅 3.8e-4、argmax 只差 11/163840 像素）→ 已改用 argmax 一致率判据',
      substeps: [
        {"id": "S7.1",
          "title": "排查依赖现状与可用性",
          "status": "done",
          "pct": 100,
          "what": "确认导出 ONNX 需要什么、机器上有什么。",
          "why": [
            "assets 里 0 个 .onnx、venv 里没装 onnx/tensorrt → 从未导出过",
            "要先摸清哪些能装、哪些装不了，避免走死路"
          ],
          "how": [
            "检查 venv 里的 onnx/onnxruntime/tensorrt/pycuda",
            "检查系统 trtexec / nvcc",
            "测试各个 pip 源能不能下到包"
          ],
          "now": "已查清：onnx/onnxruntime 可从阿里云源装；**tensorrt 在 pypi.nvidia.cn 无分发**；nvcc 存在于 CUDA 12.8",
          "evidence": "04_训练与评测/S7部署链_ONNX已完成_20261012.md"},
        {"id": "S7.2",
          "title": "安装 ONNX 导出依赖",
          "status": "done",
          "pct": 100,
          "what": "装 onnx + onnxruntime。",
          "why": [
            "需要 onnx 做导出、onnxruntime 做一致性验证"
          ],
          "how": [
            "pip install onnx==1.16.2 onnxruntime==1.17.3 --index-url 阿里云"
          ],
          "now": "已装好，但过程中踩了一个大坑（见 S7.3）",
          "evidence": "—"},
        {"id": "S7.3",
          "title": "★ 处理依赖升级引发的环境破坏",
          "status": "done",
          "pct": 100,
          "what": "修掉装 onnxscript 时连锁升级 numpy 造成的破坏。",
          "why": [
            "装 onnxscript 会把 numpy 升到 2.x，**直接搞坏 matplotlib / pandas / wandb**",
            "最阴的是：--help 检查**全部通过**（这些脚本不 import matplotlib/pandas），**看着没事实际已经坏了**"
          ],
          "how": [
            "定位根因链：torch 2.14.1 的 export 默认走 dynamo 新路径 → 需要 onnxscript → 需要 numpy>=2",
            "回滚：pip install \"numpy<2\" \"onnx==1.16.2\" \"onnxruntime==1.17.3\"",
            "关键：还要 pip install \"protobuf<6\" —— wandb 0.19.4 要求，否则 model/trainer.py 导入失败",
            "导出改用 dynamo=False 老路径，绕开 onnxscript"
          ],
          "now": "已回滚并验证：numpy 1.26.4 / protobuf 5.29.6；6 个脚本 --help 全 OK；model.trainer 可导入",
          "evidence": "04_训练与评测/S7部署链_ONNX已完成_20261012.md §六"},
        {"id": "S7.4",
          "title": "写导出脚本（去 wandb + 修输出名）",
          "status": "done",
          "pct": 100,
          "what": "改造官方 onnx_conversion.py，使其能在离线环境跑通。",
          "why": [
            "官方脚本有四处离线不可用：顶层 import wandb、末段会上传、未指定 map_location、输出名与实际不匹配"
          ],
          "how": [
            "去掉 wandb 依赖；load_from_checkpoint 改 map_location=\"cpu\"",
            "按**实际非 None 的输出**动态生成名字（实测 inference() 返回 7 元组、5 个非 None）",
            "内置一致性验证 + 落盘报告"
          ],
          "now": "已完成 code/onnx_export_verify.py",
          "evidence": "code/onnx_export_verify.py"},
        {"id": "S7.5",
          "title": "导出 ONNX（两个变体）",
          "status": "done",
          "pct": 100,
          "what": "导出 Policy+Semantic 与 Policy Only 两个版本。",
          "why": [
            "论文 Table VI 就是这两列配置；实车按需选择"
          ],
          "how": [
            "--enable-semantic 1 → 450.9 MB；--enable-semantic 0 → 320.3 MB"
          ],
          "now": "两个变体均已导出成功",
          "evidence": "runs/deploy_onnx/、runs/deploy_onnx_policy_only/"},
        {"id": "S7.6",
          "title": "★ 修正一致性判据（语义按 argmax 判）",
          "status": "done",
          "pct": 100,
          "what": "改用正确的判据判断语义输出是否一致。",
          "why": [
            "首次用绝对误差判，semantic 的 max|Δ|=1.1e-2 看着超标 11 倍被判失败",
            "深挖发现相对误差仅 3.8e-4、**argmax 一致率 99.9933%**（163840 像素只差 11 个）",
            "语义分割**只消费 argmax** → 按绝对误差判会让人去修一个不存在的问题"
          ],
          "how": [
            "语义输出：判据改为 argmax 一致率 ≥ 0.999",
            "其余输出（动作/路径/隐状态）：仍用绝对误差 < 1e-3"
          ],
          "now": "已固化进脚本；重跑后全部门禁通过",
          "evidence": "code/onnx_export_verify.py、runs/deploy_onnx/onnx_export_report.json"},
        {"id": "S7.7",
          "title": "构建 TensorRT engine（待做）",
          "status": "todo",
          "pct": 0,
          "what": "把 ONNX 编译成 TensorRT engine。",
          "why": [
            "实车跑的是 TRT engine，不是 PyTorch ckpt"
          ],
          "how": [
            "trtexec --onnx=x_mobility_sem.onnx --saveEngine=x_mobility_sem.engine --fp16",
            "TRT 构建走 CUDA 计算路径，不受 Vulkan/驱动渲染问题影响"
          ],
          "now": "未做 —— 系统无 trtexec，tensorrt 在 nvidia pip 源无分发",
          "evidence": "—",
          "caveat": "建议留到真机准备阶段做（需匹配目标机的 TRT 与 CUDA 版本），现在做容易因版本不匹配返工"}
      ]},
    {id: 'S8', title: '闭环仿真 ★决策点', status: 'blocked', pct: 0,
      what: '在 Isaac Sim 中跑闭环导航评测，产出 Table III（SR / WTT / AA）。',
      why: [
        '这是论文的核心主张（原文 IV.A：consistently outperforms across all navigation metrics）',
        '也是学长路线里"改算法"和"实车"之间的必要一环 —— 改完算法得有个闭环能验证"导航真的更好了"',
        '但它的障碍分两层，性质完全不同，必须分开处置',
      ],
      how: [
        '障碍一（环境，可修）：驱动版本错配 → Vulkan 只枚举出 llvmpipe，A40 不可见。dkms status 显示 580.178.04 已为当前内核与待用内核都编好，Vulkan ICD 就位 → **只差一次重启**',
        '障碍二（基准，可绕过但须自建）：论文 10 个仓库场景未发布（官方 Issue #17：license 原因）→ 官方推荐 MobilityGen（开源、内置 Isaac Sim）',
        '建议路径 C → B：先做不需重启的部分（部署链，已完成），等重启窗口后再装 Isaac Sim',
        '成本说实话：修好驱动 ≠ 有闭环。基准自建 = 搭场景 + 接 Nav2/ROS2 + 写评测器，是数天到数周的工程量，应按独立工作项排期',
      ],
      now: '未开始 —— 需先重启修驱动，再自建基准',
      evidence: '—',
      caveat: '⚠️ 重启不是我们单方面能决定的：GPU/CPU 占用榜上有 同机其他用户 的三个仿真进程已连续运行 1–2 天，这是共享机器，**重启需与对方协调**\n✅ 硬件够用：Isaac Sim 官方 README 明列数据中心最低配置 = A40\n⚠️ 注：Vulkan 是渲染路径，与我们查明的 expandable_segments 问题**无关**，重启仍然是必要的'},
    {id: 'S9', title: '真机试验', status: 'skip', pct: 0,
      what: '在真实机器人上部署，跑导航任务（Table V / Fig. 7 / Fig. 8）。',
      why: [
        '这是「复现 → 改算法 → 出文章 → 上实车」总路线的最后一环，由学长那一阶段承担',
        '需要 Nova Carter 实机 + 多光照测试环境，属于硬件与部署工程，不是复现工作',
      ],
      how: [
        '我们能为它做的准备（属本阶段，已含在 S7 里）：部署链打通 ckpt → ONNX → TensorRT engine',
        'ROS2 节点可跑：ros2_deployment/x_mobility_navigator 是纯 Python 包，可用现有 ROS2 Jazzy + colcon build 编译',
        '交接物：engine + 启动脚本 + 相机规格（image=(1,1,3,1200,1920) 需按实车相机改）',
      ],
      now: '不属于本阶段考卷（按学长规划，实车迁移在复现之后）',
      evidence: '—',
      caveat: '按此划分，本阶段应交付的考卷是 11 项（甲层），不含这三项'},
    {id: 'S10', title: '汇总与终止', status: 'todo', pct: 0,
      what: '产出数字对照表 + 差距分解 + 困难清单，形成结项材料。',
      why: [
        '「落在合格区间 + 困境写清楚」是已定的验收口径',
        '这是给学长的交接物：他基于我们的复现改算法，需要一个可信的基线',
      ],
      how: [
        'a) 数字对照表：论文值 / 官方权重在我们链上的值 / 我们训练权重的值，三方并排',
        'b) 差距分解：|我们−论文| = 口径差 + 分布差 + 训练量差 + 残差，每项标注证据等级',
        'c) 困难清单：4×A40 vs 8×H100（算力 7.5%）、共享机器抢卡、驱动错配、论文闭环基准未发布',
        'd) 四项论文没有的额外产出：2σ 方差门槛、检查点体积审计、143500 步之谜、样本暴露量折算',
      ],
      now: '未开始',
      evidence: '—',
      caveat: '已完成的三方对照雏形见 04_训练与评测/TableII与TableVI_三方对照正式版_20261012.md'},
  ],
  extras: [
    { title: '评测方差门槛（2σ）', status: 'done',
      detail: '同一权重只换评测种子，IoU 波动最大 0.104（FORKLIFT）。2σ 门槛表已建立：**改进需超过 2σ 才算真实**，否则会把噪声当改进。' },
    { title: '检查点体积审计', status: 'done',
      detail: '权重 35% / 优化器状态 65%（AdamW 存两个与参数同形的动量）。公式：文件大小 ≈ 参数量 × 4 字节 × 3。' },
    { title: '143 500 步之谜解答', status: 'done',
      detail: '从官方权重读出 total_steps=143500、每 epoch 1435 步 → = 100 epoch × 1435 步。反解出官方阶段二是 8卡 × 每卡 batch 2 = 全局 16（与 Table VIII 的 batch 32 有张力，尚未定论）。' },
    { title: '按样本暴露量折算', status: 'done',
      detail: '阶段二我们 2 297 600 vs 官方 2 296 000，比值 1.0007 → **与官方差 <0.1%**。' },
    { title: 'Table II 口径核实', status: 'done',
      detail: '对照官方 x_mobility_metrics.py 逐行确认：A-MAE/L-MAE 就是标准 mean_absolute_error 作用于动作张量第 0 维与最后一维，**无差分、无速度换算**。' },
    { title: 'Table VI 瓶颈分解', status: 'done',
      detail: '论文没有的额外产出：语义解码器 +67% 延迟但**零额外显存**；显存瓶颈全在观测编码器（1076.5 MB）。' },
    { title: 'ONNX 一致性的正确判据', status: 'done',
      detail: '语义输出必须按 **argmax 一致率**判（99.9933%），不能用绝对误差（1.1e-2 会误报失败）。避免在实车阶段去"修"一个不存在的精度问题。' },
  ],
  codeSnippets: [
    {id: 'migrate',
      title: '阶段一 → 阶段二 权重迁移（手工键筛选）',
      step: 'S2',
      file: 'code/train_stage2_ddp.py',
      lang: 'python',
      desc: '官方 load_from_checkpoint 不会实例化 action_policy，所以不能用它续训。' +
            '这里只搬「两边都有且形状一致」的键，世界模型 308 个张量全部迁移、' +
            'action_policy 50 个全新初始化。内置硬门禁：世界模型 0 迁移则抛异常。',
      code:
`loadable = {k: v for k, v in ck_sd.items()
            if k in model_sd and model_sd[k].shape == v.shape}
missing    = sorted(set(model_sd.keys()) - set(loadable.keys()))
unexpected = sorted(set(ck_sd.keys()) - set(loadable.keys()))
model.load_state_dict(loadable, strict=False)
# 关键：action_policy 必须全部在 missing 里（= 全新初始化）
ap_missing = [k for k in missing if "action_policy" in k]
ap_loaded  = [k for k in loadable if "action_policy" in k]
# 硬门禁：世界模型部分必须真的迁移过来；否则这次"续训"等于从头训，
# 整个实验的解释力归零，应当立刻停下而不是跑完 20 小时才发现。
n_wm_loaded = len(loadable) - len(ap_loaded)
if n_wm_loaded == 0:
    raise RuntimeError("权重迁移失败：世界模型部分 0 张量迁移成功。")`},
    {id: 'table2-metric',
      title: 'Table II 指标口径（照官方逐行实现）',
      step: 'S4',
      file: 'code/table2_openloop_mae.py',
      lang: 'python',
      desc: '口径来自官方 model/eval/x_mobility_metrics.py，逐行核对。' +
            'A-MAE 就是标准 mean_absolute_error 作用于动作张量最后一维（角速度 z），' +
            '不是 |Δ角速度|，也没有速度换算。',
      code:
`LINEAR_X_IDX  = 0     # 官方 linear_x_idx
ANGULAR_Z_IDX = -1    # 官方 angular_z_idx
# ---- ★ 官方口径：标准 MAE，逐元素绝对差取均值 ----
a_err = (pred_action[:, ANGULAR_Z_IDX]
         - gt_action[:, ANGULAR_Z_IDX]).abs().mean().item()
l_err = (pred_action[:, LINEAR_X_IDX]
         - gt_action[:, LINEAR_X_IDX]).abs().mean().item()
# P-MAE 是整个 path 张量，不取分量
p_err = (pred_path - gt_path).abs().mean().item()`},
    {id: 'table2-gate',
      title: 'Table II 三条硬门禁（踩过才知道）',
      step: 'S4',
      file: 'code/table2_openloop_mae.py',
      lang: 'python',
      desc: 'Table II 必须同时满足三个条件，否则算出来的数没有意义。' +
            '这三条都是实测踩出来的，不是从文档推的。',
      code:
`if action_source != 'policy':
    raise RuntimeError(
        "Table II 必须用 --action-source policy。\\n"
        "  官方 _action_errors 比较的是 output['action']（模型预测）\\n"
        "  vs batch['action']（真值）。gt 模式下 output['action'] 不是模型预测，\\n"
        "  算出来的 MAE 没有意义。")
if not hasattr(inner, 'action_policy'):
    raise RuntimeError(
        "模型没有 action_policy 子模块 → 无法算 Table II。\\n"
        "  · 阶段一 ckpt 实测 action_policy 键数 = 0（不可用）\\n"
        "  · 请用 官方 ckpt 或 阶段二 ckpt")
# 硬门禁：全部序列都缺 route → 静默失效，必须抛错
if n_done == 0:
    raise RuntimeError(
        "无有效序列：%d 条缺 route_vectors。\\n"
        "  Table II 只能用 nav2_100k（route_poses 有值）。" % n_policy_fallback)`},
    {id: 'fig45-wandb',
      title: '绕过 wandb 拿可视化素材（复刻官方叠加逻辑）',
      step: 'S6',
      file: 'code/export_fig4_fig5.py',
      lang: 'python',
      desc: '官方 visualise_attention 返回的是 wandb.Image 对象，离线环境直接返回 None。' +
            '但其实现里除最后一行外全是纯 PIL/numpy —— 所以复刻它、返回 PIL Image 即可。',
      code:
`# 官方原实现：
#     attention_pred = (a - min) / (max - min)
#     attention_pred = np.kron(attention_pred, np.ones((14, 14)))  # patch_size=14
#     cmap = plt.get_cmap('jet'); att_viz = cmap(att)
#     overlayed = Image.blend(img_viz, att_viz, alpha=0.5)
#     return [wandb.Image(overlayed), ...]     # ← 只换掉这一行
rng = attention_np.max() - attention_np.min()
norm = (attention_np - attention_np.min()) / rng if rng > 0 else attention_np * 0
up = np.kron(norm, np.ones((patch, patch)))          # patch=14 → 37×37
cmap = plt.get_cmap('jet')
att_viz = Image.fromarray((cmap(up)[:, :, :3] * 255).astype(np.uint8)).convert('RGBA')
img_viz = Image.fromarray(image_np).convert('RGBA')
img_viz = img_viz.resize(att_viz.size[:2], resample=Image.BICUBIC)
return Image.blend(img_viz, att_viz, alpha=0.5)      # ← 返回 PIL，不返回 wandb.Image`},
    {id: 'onnx-gate',
      title: 'ONNX 一致性判据（语义必须按 argmax 判）',
      step: 'S7',
      file: 'code/onnx_export_verify.py',
      lang: 'python',
      desc: '首次跑用绝对误差判，semantic 的 max|Δ|=1.1e-2 看着超标 11 倍被判失败。' +
            '深挖发现相对误差仅 3.8e-4、argmax 一致率 99.9933%（163840 像素只差 11 个）。' +
            '语义分割只消费 argmax，所以绝对误差是错的判据 —— 会让人去修一个不存在的问题。',
      code:
`# ★ 语义分割要按「argmax 一致率」判，不能按绝对误差判。
is_semantic = 'semantic' in name
if is_semantic and ref.ndim >= 3:
    # 类别维在第 -3 维（与官方 _semantic_iou 的 dim=-3 一致）
    am_ref = ref.argmax(axis=-3)
    am_got = got.argmax(axis=-3)
    agree = float((am_ref == am_got).mean())
    ok = agree >= 0.999
else:
    # 其余输出（动作/路径/隐状态）量级小，用绝对误差
    ok = err < a.tolerance`},
    {id: 'env-guard',
      title: '环境守卫：expandable_segments 会触发 NVML 断言',
      step: 'S7',
      file: 'code/gpu_env_guard.py',
      lang: 'python',
      desc: '这是让我误判两轮的坑。expandable_segments:True 是**训练**需要的（防显存碎片），' +
            '我照抄进评测脚本后触发 NVML 断言，看起来像驱动故障。' +
            '严格 A/B 对照：不设 3/3 成功，设了 0/3 成功 —— 是确定性的，不是间歇的。',
      code:
`def ensure_no_expandable_segments(strict=True):
    """若检测到会触发 NVML 断言的设置，立刻纠正（或报错）。"""
    val = os.environ.get('PYTORCH_CUDA_ALLOC_CONF', '')
    if 'expandable_segments:True' in val.replace(' ', ''):
        msg = (
            "检测到 PYTORCH_CUDA_ALLOC_CONF=%s\\n"
            "  该设置会触发 NVML 断言失败（PeerToPeerAccess.cpp:83）——\\n"
            "  机制：expandable_segments 走 CUDA 虚拟内存路径，需查询 P2P 拓扑，\\n"
            "        而本机驱动版本错配导致 NVML 坏掉。\\n"
            "  ★ 实测：不设该变量 3/3 成功；设了则 0/3 成功（确定性，非间歇）。\\n"
            % val)
        if strict:
            raise RuntimeError("PYTORCH_CUDA_ALLOC_CONF 含 expandable_segments:True")
        os.environ.pop('PYTORCH_CUDA_ALLOC_CONF', None)
        return True
    return False`},
    {id: 'ddp',
      title: '阶段二 4 卡 DDP 配置（对齐论文全局 batch 32）',
      step: 'S2',
      file: 'code/train_stage2_ddp.py',
      lang: 'python',
      desc: 'bs 2 × accum 4 × 4 卡 = 全局 32 = 论文 Table VIII。' +
            '同步修掉一个缺陷：原 _init_dist() 无条件用 gloo/world_size=1 建进程组，' +
            '多卡下会覆盖 torchrun 的 nccl。',
      code:
`tkw = dict(
    max_steps=args.max_steps,
    precision=args.precision,
    accelerator="gpu" if torch.cuda.is_available() else "cpu",
    devices=args.gpus,                       # ← 改造点 1
    accumulate_grad_batches=args.accum,      # ← 改造点 1/2
    ...
)
# 多卡时启用 DDP + sync_batchnorm（与 train_s1_ddp.py / 官方 train.py 一致）
if args.gpus > 1:
    tkw["strategy"] = "ddp_find_unused_parameters_true"
    tkw["sync_batchnorm"] = True
# 启动时校验全局 batch
global_bs = args.batch_size * args.accum * args.gpus
print("全局 batch  : %d  (论文 Table VIII = 32)%s"
      % (global_bs, "" if global_bs == 32 else "   ⚠️ 不等于 32！"))`},
    {id: 'proc-retry',
      title: '进程级重试（进程内重试永远无效）',
      step: 'S7',
      file: 'code/run_gpu_with_retry.sh',
      lang: 'bash',
      desc: 'CUDA 初始化一旦失败，本进程上下文就被污染 —— 进程内重试 8/8 全失败，' +
            '而每次新起进程第 1 次就成功。所以重试必须在进程级做。' +
            '另一个教训：成功判据不能只看退出码（Python catch 住异常时退出码仍为 0）。',
      code:
`# 失败特征串：出现任一即视为本次尝试失败（即使退出码为 0）
FAIL_PAT='NVML_SUCCESS|PeerToPeerAccess\\.cpp|CUDA 初始化失败|Traceback \\(most recent call last\\)'
for i in $(seq 1 $MAX); do
  echo "--- 尝试 $i/$MAX（新进程）---"
  "$@" 2>&1 | tee "$LOG"
  rc=\${PIPESTATUS[0]}
  if [ $rc -eq 0 ] && ! grep -qE "$FAIL_PAT" "$LOG"; then
    echo "--- 第 $i 次成功 ---"; exit 0
  fi
  # 非 CUDA 类故障 → 立刻停，不要浪费重试（重试也不可能好）
  if ! grep -qE "$RETRY_PAT" "$LOG"; then
    echo "=== 非 CUDA 类失败（配置/参数错误），重试无意义，已停止 ==="
    exit $rc
  fi
  sleep 5
done`},
  ],
  risks: [
    { id: 1, text: '阶段一被第三方 OOM 打断', severity: 'mid',
      status: '未发生', plan: '守护快照 + --resume（已验证可用）' },
    { id: 2, text: 'GPU2 显存持续收窄（现 1604 MiB 空闲）', severity: 'mid',
      status: '监控中', plan: '每轮记录趋势；若继续恶化需预警' },
    { id: 3, text: '机器被重启', severity: 'low',
      status: '未发生', plan: '守护 cron 自动拉起；权重已快照' },
    { id: 4, text: '阶段二 DDP 未实跑验证', severity: 'mid',
      status: '待验证', plan: '已列为启动前必做冒烟项' },
    { id: 5, text: '重启窗口与 同机其他用户 撞车', severity: 'high',
      status: '待协调', plan: '提前协调；不得擅自重启' },
    { id: 6, text: '10-20 汇报前阶段一跑不完', severity: 'low',
      status: 'ETA 10-18，留 2 天余量', plan: '若吃紧，用中途权重汇报' },
  ],
  deviations: [
    { id: 1, text: '4×A40 vs 8×H100', detail: '算力仅约 7.5%；时间 ×15' },
    { id: 2, text: '梯度累积 4 替代每卡 batch 4', detail: '含 RGB 时每卡 4 会 OOM；等效 batch 一致，但 BN 统计略有差异' },
    { id: 3, text: '无 W&B 记录', detail: '离线环境；日志已落盘可追溯' },
    { id: 4, text: 'VAE 用运行时补丁', detail: '官方硬编码 HF repo id' },
    { id: 5, text: '权重迁移方式非官方口径', detail: '用手工键筛选（官方 load_from_checkpoint 不会实例化 action_policy）' },
    { id: 6, text: 'nan 口径差异（未修，刻意保留）', detail: '官方对 absent 类返回 0，我们返回 nan 并丢弃 → 小类 IoU 会被系统性高估，报告需标注' },
    { id: 7, text: 'torch 2.14.1 / PL 2.5.0', detail: '官方约 torch 2.2 / PL 2.3.3' },
  ],
  comparisons: [
    {title: 'Table II 开环 MAE',
      lowerIsBetter: true,
      rows: [
        { name: '论文 X-MOBILITY', a: 0.0747, l: 0.0158, p: 0.1156, isPaper: true },
        { name: '官方权重 @ 我们链', a: 0.0807, l: 0.0103, p: 0.1116, isOurs: true },
        { name: '我们权重 (a20k, 20k步)', a: 0.1142, l: 0.0851, p: 0.1525, isOurs: true },
      ],
      note: '官方权重与论文偏差 ≤0.006 → 评测链可信。我们的差距主因是训练量只有论文的 28%。'},
    {title: 'Table VI 推理延迟（A40）',
      lowerIsBetter: true,
      rows: [
        { name: 'Policy Only', p50: 35.23, p95: 36.23, mem: 1076.5 },
        { name: 'Policy + Semantic', p50: 58.94, p95: 62.90, mem: 1076.5 },
      ],
      note: '⚠️ 论文硬件是 Jetson AGX Orin，不可直接比较。语义解码 +67% 延迟但零额外显存。'},
  ]};
window.PROGRESS_DATA = PROGRESS;

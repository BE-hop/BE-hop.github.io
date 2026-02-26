# RU-LineArt 更新配置说明

本目录用于维护 RU-LineArt 的在线更新信息。  
桌面端更新器只需要读取一个文件：

- `behop-ai-product/products/ru-lineart/version.json`

## 1) version.json 字段约定

```json
{
  "latest": "1.4.0",
  "force": false,
  "page": "https://www.behop.cn/behop-ai-product/products/ru-lineart/",
  "notes": "Bug fixes and quality improvements."
}
```

- `latest`: 最新版本号（语义化版本，例：`1.4.1`）
- `force`: 是否强制更新（`true` / `false`）
- `page`: 更新弹窗打开的下载页面（当前固定为产品页）
- `notes`: 本次更新说明（建议 1-2 句）

## 2) 每次发版最小操作

1. 修改 `version.json` 的 `latest`、`force`、`notes`（`page` 通常不变）。
2. 更新产品页下载内容（网盘链接、提取码、更新说明）。
3. 提交并部署站点。

## 3) 网盘链接更新位置

当前产品页源文件：

- `_ai_products/ru-lineart.md`

建议每次发版时，把最新网盘链接写在该文件的中文介绍区域（和英文区域）中，保证 `page` 打开后用户可直接下载。

## 4) 发布前校验

在仓库根目录执行：

```bash
python3 -m json.tool behop-ai-product/products/ru-lineart/version.json >/dev/null
```

无输出且退出码为 `0` 即 JSON 语法正确。

## 5) 线上地址

部署后应可访问：

- `https://www.behop.cn/behop-ai-product/products/ru-lineart/version.json`

<!-- README.md -->

# メール・パスワード認証アプリ (React / Redux Toolkit / Firebase)

Firebase Authentication を利用した、メール・パスワード認証（登録 / ログイン / ログアウト）を行うシンプルな Web アプリです。
実務レベルの「**責務分離**」「**エラーハンドリング**」「**テスト容易性**」を重視した設計を行っています。

---

## 🚀 主な機能

- **ユーザー登録・ログイン・ログアウト**
- **メール認証**: 登録時の認証メール送信機能
- **ルーティング保護**: `PrivateRoute` による、未認証ユーザーのアクセス制限
- **通知システム**: Snackbar を利用した、成功・失敗時の即時フィードバック
- **エラー正規化**: Firebase 固有のエラーをアプリケーション共通形式に変換して表示

## 🛠 技術スタック

### フロントエンド

- **Framework**: React
- **State Management**: Redux Toolkit (Thunk)
- **Routing**: React Router
- **UI Components**: Material UI (MUI)

### バックエンド / インフラ

- **Authentication**: Firebase Authentication

### テスト

- **Runner**: Vitest
- **Library**: React Testing Library

---

## 🏗 アーキテクチャ概要

UI 層からデータ層まで、依存関係を一方通行に整理し、Firebase への直接的な依存を最小限に抑えています。

### 階層別の役割

1. **UI (components)**: 表示に専念。状態管理や Firebase の仕様を意識しない。
2. **Hooks (useAuthForm)**: View とロジックの橋渡しを担当。
3. **Redux (authThunks)**: アプリケーションロジックおよび非同期処理の制御。
4. **Model (AuthModel)**: Firebase SDK のラッパー。エラーの正規化とデータ抽出を担当。

### ディレクトリ構成（抜粋）

```text
src/
├─ components/
│  ├─ routing/       # PrivateRoute (認証ガード)
│  └─ widgets/       # AuthForm (View/Hook 分離)
├─ models/           # Firebase 依存をここに集約
│  └─ errors/        # ModelError.js (エラー正規化定義)
├─ redux/            # Slices, Thunks, Middlewares
├─ firebase/         # Firebase Config
└─ test/             # 各レイヤーのユニットテスト



## 🔒 認証フロー & セキュリティ

堅牢なユーザー体験を提供するため、初期化プロセスとルーティング制御を厳密に分離しています。

### 1. 初期化プロセス
アプリ起動時に `initAuthAsync` を dispatch し、Firebase の `onAuthStateChanged` を購読します。
- **認証確認中**: ローディング画面を表示し、未確定状態での不正なリダイレクトを防止。
- **確認完了後**: `authChecked = true` となり、適切な画面へのルーティングを許可します。

### 2. PrivateRoute の制御
以下の条件をすべて満たさない限り、プライベートなリソースへのアクセスを拒否し、ルートパス（`/`）へリダイレクトします。
* **認証確認完了** (`authChecked`)
* **ログイン済み** (`user` が存在)
* **メールアドレス検証済み** (`emailVerified`)

---

## ⚠️ エラーハンドリング設計

エラーの発生からユーザーへの通知までを自動化し、各レイヤーでの重複コードを排除しています。



| レイヤ | 役割 |
| :--- | :--- |
| **Model** | Firebase SDK のエラーを捕捉し、独自クラス `ModelError` へ正規化。 |
| **Thunk** | ビジネスロジックを実行。エラー時は `rejectWithValue` で状態を更新。 |
| **Middleware** | `snackbarMiddleware` が非同期処理の失敗を検知し、自動で Snackbar を表示。 |
| **UI** | 成功・失敗の判定ロジックを持たず、ステートに基づく表示のみに集中。 |

---

## ✅ テスト方針

信頼性の高いコードベースを維持するため、以下の戦略でテストを実装しています。

* **完全な Mock 化**: Firebase SDK を完全に Mock し、ネットワーク環境に依存しない決定論的なテストを確保。
* **非同期テスト**: Redux Thunk の `unwrap()` を活用し、非同期処理の完了と副作用を明示的に検証。
* **高いカバレッジ**: ログイン成功などの正常系に加え、パスワード相違やネットワーク遮断などの異常系も網羅。

---

## 💡 今後の改善案

- [ ] パスワードリセット機能の実装
- [ ] ユーザープロフィール編集（DisplayName, Avatar等）
- [ ] アクセストークン管理の強化
- [ ] Playwright による E2E テストの導入

---

## 🔗 リポジトリ

**GitHub**: [https://github.com/MasatakeI/email_authentication.git](https://github.com/MasatakeI/email_authentication.git)
```

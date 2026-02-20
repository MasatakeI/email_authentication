# メール・パスワード認証アプリ (React / Redux Toolkit / Firebase)

Firebase Authentication を利用した、堅牢な認証基盤を持つ Web アプリケーションです。
単なる機能実装に留まらず、実務レベルの**「責務分離」「エラーハンドリング」「テスト容易性」「高カバレッジなテスト」**を徹底した設計を採用しています。

---

## 🚀 主な機能

- **認証基盤**: ユーザー登録、ログイン、ログアウト
- **セキュリティ**:
  - **メール認証**: 登録時の認証メール送信・検証機能
  - **ルーティング保護**: `PrivateRoute` による未認証・未検証ユーザーのアクセス制限
- **UX/UI**:
  - **通知システム**: Snackbar による即時フィードバック
  - **ローディング制御**: 認証状態確定までのチラつき防止（初期化プロセスの厳密化）
- **エラー正規化**: Firebase 固有のエラーをアプリ共通形式へ変換して表示

---

## 技術スタック

| カテゴリ       | 技術                                       |
| :------------- | :----------------------------------------- |
| **Frontend**   | React, Redux Toolkit (Thunk), React Router |
| **UI Library** | Material UI (MUI)                          |
| **Backend**    | Firebase Authentication                    |
| **Testing**    | Vitest, React Testing Library              |

---

## アーキテクチャ概要

UI 層からデータ層まで、依存関係を一方通行に整理し、**「Firebase への依存を特定レイヤーに閉じ込める」**設計を行っています。

### 階層別の役割

1. **UI (Components)**: 表示とユーザー入力に専念。
2. **Hooks (useAuthForm)**: View とロジックの橋渡しを担当。
3. **Redux (Thunks)**: アプリケーションロジックと非同期処理の制御。
4. **Model (AuthModel)**: Firebase SDK のラッパー。**エラー正規化**とデータ抽出を担当。

### ディレクトリ構成

```text
src/
├─ components/       # UI層：PrivateRoute（ガード）, AuthForm（View/Hook分離）
├─ models/           # データ層：Firebase依存をここに集約
│  └─ errors/        # ModelError.js (独自エラークラス定義)
├─ redux/            # 状態管理：Slices, Thunks, Middlewares
├─ firebase/         # 設定：Firebase Config
└─ test/             # 検証：各レイヤーのユニットテスト
```

# 認証フロー & セキュリティ詳細設計

本アプリケーションにおける、ユーザーの安全なアクセス管理とエラー処理の設計詳細を解説します。

---

## 🔒 認証フローと状態管理

堅牢なユーザー体験を提供するため、**「認証状態の初期化」**と**「ルーティング制御」**を厳密に分離しています。

### 1. 初期化プロセス（Initialization）

アプリ起動時、Firebase Authentication の状態が確定する前にコンテンツが表示されることを防ぎます。

- **処理内容**: `initAuthAsync` を dispatch し、`onAuthStateChanged` を購読。
- **UX への影響**:
  - **認証確認中**: 全画面ローディングを表示。
  - **確認完了後**: `authChecked = true` となり、適切な画面へ遷移。
- **メリット**: ログイン済みユーザーが一瞬だけログイン画面（AuthForm）を見てしまう「チラつき」を完全に防止します。

### 2. PrivateRoute によるアクセス制限

認証が必要なページ（Dashboard 等）は `PrivateRoute` コンポーネントで保護されています。

**【アクセス許可条件（AND 条件）】**

1.  **初期化完了**: `authChecked === true` であること。
2.  **ログイン状態**: `user` オブジェクトが存在すること。
3.  **メール検証**: `emailVerified === true` であること。

> [!IMPORTANT]
> メール認証が完了していないユーザーは、ログイン済みであってもプライベートなリソースへのアクセスを拒否し、認証待ち画面またはルートへリダイレクトします。

---

## ⚠️ エラーハンドリング設計

「Firebase の仕様を UI に持ち込まない」ことを徹底し、各レイヤーで責務を分離しています。

### 1. エラーコードの正規化（Error Code Policy）

Firebase SDK のエラーを、アプリケーション共通の `MODEL_ERROR_CODE` に変換します。

| MODEL_ERROR_CODE   | 主な Firebase エラーコード                               | UI の振る舞い                                  |
| :----------------- | :------------------------------------------------------- | :--------------------------------------------- |
| **AUTH_INVALID**   | `invalid-email`, `weak-password`, `email-already-in-use` | バリデーションエラー（入力欄赤字）             |
| **AUTH_FORBIDDEN** | `wrong-password`, `user-not-found`, `too-many-requests`  | アラートメッセージ表示                         |
| **NETWORK**        | 通信エラー全般                                           | 「通信環境を確認してください」という通知       |
| **EXTERNAL**       | その他、想定外の Firebase エラー                         | 汎用エラー（「システムエラーが発生しました」） |

### 2. 自動通知の仕組み

Redux Middleware（`snackbarMiddleware`）が、Thunk の `rejected` アクションを自動で検知します。
UI コンポーネント側で毎回 `try-catch` を書く必要がなく、エラーが発生すれば自動的に Snackbar が表示されます。

---

## ✅ テスト戦略

信頼性の高いコードベースを維持するため、以下のテスト方針を採用しています。

- **Firebase SDK の完全 Mock 化**:
  テスト環境で実際に Firebase へ通信することなく、`auth` モジュールを Mock 化。あらゆるエラーパターンを決定論的に再現します。
- **非同期処理の検証**:
  Redux Thunk の `unwrap()` を使用し、非同期処理が期待通りに成功/失敗したかをアサーションします。
- **網羅性**:
  「正しいパスワードでログインできるか」だけでなく、「パスワードを間違えた時に適切な正規化エラーが返るか」という異常系を重視しています。

---

## 📅 今後のロードマップ

- [ ] **パスワードリセット機能**: 忘れたユーザーへのメール送信フロー。
- [ ] **プロフィール管理**: ユーザー名（DisplayName）やアバターの変更。
- [ ] **E2E テスト**: Playwright を導入し、ブラウザ実機での挙動確認を自動化。

---

## 🔗 プロジェクトリソース

- **GitHub Repository**: [https://github.com/MasatakeI/email_authentication.git](https://github.com/MasatakeI/email_authentication.git)
- **作成者**: MasatakeI

```

```

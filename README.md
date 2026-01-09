<!-- README.me -->

# Email Authentication App 　　　 React / Redux Toolkit / Firebase

## 概要

Firebase Authentication（Email / Password）を用いた
認証機能付きシンプル SPA です。

ユーザー登録・ログイン・ログアウトを通じて、
認証状態を Redux で一元管理し、状態に応じた UI・画面遷移を行います。

本プロジェクトでは特に以下を重視して設計・実装しています。

・Redux Toolkit を用いた 実務的な状態管理
・Model / Thunk / Slice / UI の 明確な責務分離
・非同期処理とエラーハンドリングの整理
・将来的な拡張・テストを見据えた構成

---

## 主な機能

-ユーザー新規登録（Email / Password） -ログイン -ログアウト
-Firebase Authentication 連携 -認証状態の Redux 管理 -ログイン成功時のみ MainPage に遷移 -ログアウト成功時のみ HomePage に遷移 -エラーメッセージ表示（正規化済み）

---

## 技術スタック

- **React**
- **Redux Toolkit**

  - createSlice
  - createAsyncThunk
  - createSelector

- **React Redux**
- **React Router**
- **Firebase Authentication**
- **CSS（コンポーネント単位）**

---

## ディレクトリ構成（抜粋）

```txt
src/
├─ components/
│  ├─ page/
│  │  ├─ HomePage/
│  │  └─ MainPage/
│  ├─ widgets/
│  │  └─ AuthForm/
│  └─ common/
│     └─ Button/
│
├─ redux/
│  ├─ store/
│  │  ├─ rootReducer.js
│  │  └─ index.js
│  └─ features/
│     └─ auth/
│        ├─ authSlice.js
│        ├─ authThunks.js
│        ├─ authSelectors.js
│        ├─ authErrorCodes.js
│        └─ normalizeAuthError.js
│
├─ models/
│  ├─ AuthModel.js
│  └─ errors/
│     └─ ModelError.js
│
├─ auth/
│  └─ auth.js
│
└─ App.jsx

```

---

## 設計方針

本アプリケーションでは、実務での保守性・拡張性・テスト容易性を重視し、
以下の設計方針に基づいて実装しています。

### 1. 責務分離

| レイヤー       | 役割                          |
| -------------- | ----------------------------- |
| components     | UI・ユーザー操作              |
| redux/features | 状態管理・非同期処理          |
| models         | 業務ルール・外部 API 呼び出し |
| Firebase SDK   | 認証インフラ                  |

UI / Redux / Firebase が直接依存しない構成を意識しています。

### 2. Model では業務ルールのみを扱う

AuthModel では以下のみを責務としています。

・入力値バリデーション
・Firebase Authentication API 呼び出し
・業務的に意味のあるエラーの送出（ModelError）

if (!email || !password) {
throw new ModelError(MODEL_ERROR_CODE.VALIDATION, "...");
}
Firebase 由来のエラー解釈は Model では行いません。

---

### 3. Thunk でのエラー正規化

Firebase Authentication のエラーや ModelError は
Thunk 層で 共通フォーマットに正規化しています。
{
code: string,
message: string
}

UI / Slice はエラーの種類を意識しない
Firebase SDK への依存を Redux に持ち込まない

return rejectWithValue(normalizeAuthError(error));

---

### 4. Slice は状態管理に専念

非同期処理の実装は行わない
fulfilled / rejected の結果のみを反映
error は常に { code, message } 形式

## state.error = action.payload;

### 5. 非同期成功を unwrap で制御

await dispatch(signInUserAsync(payload)).unwrap();
成功時のみ画面遷移・UI 更新
失敗時は catch で制御
👉 実務を想定した 明示的な成功制御 を採用しています。

### 6. デバッグは Redux DevTools 前提

console.log に依存しない

Action → payload → state を可視化

実務でのデバッグフローを意識

## テスト戦略

本プロジェクトでは、すべてを網羅的にテストするのではなく、責務ごとにテスト対象を取捨選択する方針を採用しています。

基本方針

ロジックを持つ層を重点的にテスト

外部ライブラリや薄いラッパーは過剰にテストしない

テストの重複を避け、保守コストを抑える

レイヤー別テスト方針
レイヤー テスト方針
models 重点的にテスト（単体テスト）
redux/thunks 必要に応じてテスト（error 正規化・分岐）
redux/slice reducer の振る舞いを必要最小限で確認
components 本プロジェクトでは未実装（今後追加予定）
Model 層のテスト（AuthModel）

Model 層は以下の理由から 最も重要なテスト対象としています。

Firebase など外部 API との境界

業務バリデーション（入力チェック）

例外（ModelError）の発生条件

テスト内容

正常系

Firebase API が正しく呼ばれる

戻り値（user）が期待通り返る

異常系

バリデーションエラー（ModelError）

Firebase エラーがそのまま throw されること

Firebase API は Vitest の mock を用いて完全にスタブ化しています。

エラー処理のテスト戦略
ModelError

ModelError 自体はロジックを持たないため 単体テストは必須としていません

利用側（Model / Thunk）のテストで 間接的に検証しています

normalizeAuthError

Thunk 層で Firebase エラーを正規化

UI に依存しないエラー形式 { code, message } を保証

👉 UI 層は error.code / error.message のみを見る設計

## 今後の改善予定

- 認証状態の永続化（onAuthStateChanged）
- ProtectedRoute の実装
- Snackbar / Toast による通知 UI
- authSlice / authThunks のテスト追加

---

## 学習・ポートフォリオ観点

・本プロジェクトでは以下の理解・実践を目的としています。
・Redux Toolkit を用いた実務的な状態管理
・非同期処理と UI 更新の責務分離
・エラーハンドリング設計

拡張・保守を意識したディレクトリ設計

---

## 作者

M I

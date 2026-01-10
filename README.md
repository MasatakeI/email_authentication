<!-- README -->

# Email Authentication App

**React / Redux Toolkit / Firebase**

---

## 概要

Firebase Authentication（Email / Password）を利用した  
**認証機能付きシンプル SPA** です。

ユーザー登録・ログイン・ログアウトを通じて  
**認証状態を Redux で一元管理** し、  
状態に応じた UI 表示・画面遷移を行います。

本プロジェクトでは、実務を意識し、特に以下を重視して設計・実装しています。

- Redux Toolkit を用いた実務的な状態管理
- Model / Thunk / Slice / UI の明確な責務分離
- 非同期処理とエラーハンドリングの一元化
- 将来的な拡張・テストを見据えた構成

---

## 主な機能

- ユーザー新規登録（Email / Password）
- ログイン / ログアウト
- Firebase Authentication 連携
- 認証状態の Redux 管理
- ログイン成功時のみ MainPage に遷移
- ログアウト時に認証状態をクリア
- 成功通知（Snackbar）
- エラー情報の正規化管理（code / message）

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
│  ├─ pages/
│  │  ├─ HomePage/
│  │  └─ MainPage/
│  ├─ widgets/
│  │  └─ AuthForm/
│  └─ common/
│     └─ SimpleSnackbar/
│
├─ redux/
│  ├─ store/
│  │  ├─ rootReducer.js
│  │  └─ index.js
│  └─ features/
│     ├─ auth/
│     │  ├─ authSlice.js
│     │  ├─ authThunks.js
│     │  ├─ authSelectors.js
│     │  ├─ authErrorCodes.js
│     │  └─ mapAuthErrorToModelError.js
│     └─ snackbar/
│        ├─ snackbarSlice.js
│        └─ snackbarSelector.js
│
├─ redux/utils/
│  └─ createThunk.js
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
設計方針
1. 責務分離
レイヤー	役割
components	UI・ユーザー操作
redux/features	状態管理・非同期制御
models	業務ルール・外部 API 呼び出し
Firebase SDK	認証インフラ

UI / Redux / Firebase が直接依存しない構成を意識しています。

2. Model 層は業務ルールのみを扱う
AuthModel の責務は以下に限定しています。

入力値バリデーション

Firebase Authentication API 呼び出し

業務的に意味のある例外（ModelError）の送出

js
コードをコピーする
if (!email || !password) {
  throw new ModelError(
    MODEL_ERROR_CODE.VALIDATION,
    "メールアドレスとパスワードは必須です"
  );
}
Firebase 由来のエラー解釈は Model 層では行いません。

3. Firebase エラーは Thunk で ModelError に変換
Firebase Authentication のエラーは
Thunk 層で ModelError にマッピング しています。

js
コードをコピーする
throw mapAuthErrorToModelError(error);
これにより、

Firebase SDK への依存を Redux に持ち込まない

Model / Redux / UI 間でエラー形式を統一

を実現しています。

4. createThunk によるエラー一元化
すべての Thunk は共通の createThunk を使用しています。

js
コードをコピーする
{
  code: string,
  message: string
}
という形式で rejected payload を統一 し、

Slice

UI

Snackbar

が同一フォーマットで扱える設計です。

5. Slice は状態管理に専念
非同期処理は行わない

fulfilled / rejected の結果のみ state に反映

error は常に { code, message } 形式

js
コードをコピーする
state.error = action.payload;
6. 成功通知のみ Thunk から Snackbar を表示
成功時のみ showSnackbar を dispatch

エラー時の表示責務は Thunk に持たせない

js
コードをコピーする
dispatch(showSnackbar("サインイン成功"));
エラー表示は Redux state を通じて行う前提の設計です。

7. unwrap() による明示的な成功制御
js
コードをコピーする
await dispatch(signInUserAsync(payload)).unwrap();
成功時のみ画面遷移

失敗時は catch で制御

👉 実務を想定した 明示的な成功フロー制御 を採用しています。

デバッグ方針
Redux DevTools 前提

console.log に依存しない

Action → payload → state の流れを可視化

テスト戦略
基本方針
ロジックを持つ層を重点的にテスト

外部ライブラリの薄いラッパーは過剰にテストしない

テストの重複を避け、保守コストを抑える

レイヤー別テスト方針
レイヤー	方針
models	重点的に単体テスト
redux/thunks	エラー分岐・マッピングのみ
redux/slice	reducer の最小検証
components	現時点では未実装

今後の改善予定
Snackbar の severity（success / error）対応

認証エラーの共通 middleware 化

authThunks / authSlice のテスト追加

UI 側でのエラー表示統一

学習・ポートフォリオ観点
Redux Toolkit を用いた実務的な状態管理

非同期処理と UI 更新の責務分離

エラーハンドリング設計

拡張・保守を意識したディレクトリ設計

作者
M I
```

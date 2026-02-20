import React, { useLayoutEffect, useState } from "react";

import { vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Routes, Route, Router } from "react-router";
import { renderHook } from "@testing-library/react";
import { createMemoryHistory } from "history";

export const renderHookWithStore = ({
  hook,
  reducers,
  preloadedState,
  initialPath = "/",
  history = createMemoryHistory({
    initialEntries: [initialPath],
  }),
}) => {
  const store = configureStore({
    reducer: reducers,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  const dispatchSpy = vi.spyOn(store, "dispatch");

  const HistoryRouter = ({ history, children }) => {
    const [state, setState] = useState({
      action: history.action,
      location: history.location,
    });

    useLayoutEffect(() => history.listen(setState), [history]);

    return (
      <Router
        location={state.location}
        navigationType={state.action}
        navigator={history}
      >
        {children}
      </Router>
    );
  };

  const wrapper = ({ children }) => (
    <Provider store={store}>
      <HistoryRouter history={history}>
        <Routes>
          <Route path="*" element={children} />
        </Routes>
      </HistoryRouter>
    </Provider>
  );

  return { ...renderHook(() => hook(), { wrapper }, store, dispatchSpy) };
};

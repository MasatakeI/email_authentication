// src/test/components/widgets/AuthForm/AuthForm.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";

import AuthForm from "../../../../components/widgets/AuthForm/AuthForm";

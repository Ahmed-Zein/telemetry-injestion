// cypod-telemetry
import { api } from "./client";
import type { AuthResponse } from "@/types";
import type { LoginInput, RegisterInput } from "@/lib/schemas";

export async function login(data: LoginInput): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/login", data);
}

export async function register(data: RegisterInput): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password,
  });
}

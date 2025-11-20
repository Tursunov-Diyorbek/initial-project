import API_V2 from "../V2";
import { useContext } from "react";
import { MainContext } from "@/context";

// --- Interfaces ---
interface LoginPayload {
  username: string;
  password: string;
}

interface LogoutPayload {
  device_id: string | null;
  model_device: string;
  device: string;
  platform: string;
}

export interface LoginFormDataResult {
  formData: FormData;
  device_id: string;
}

export const getUserInfo = () => API_V2.get("/auth/me");

export const logoutUser = () => {
  const payload: LogoutPayload = {
    device_id: localStorage.getItem("device_id"),
    model_device: navigator.platform || "unknown",
    device: "web",
    platform: getPlatform(),
  };
  return API_V2.post("/auth/logout", payload);
};

export const refreshToken = async (refreshToken: string, deviceId: string) => {
  try {
    const response = await API_V2.post(`/auth/refresh-token`, {
      refresh_token: refreshToken,
      device_id: deviceId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export function isRole(name: string): boolean {
  const { roles } = useContext(MainContext);

  const userRoles = Array.isArray(roles) ? roles : [];

  return userRoles.some(
    (role) => role?.toLocaleUpperCase() === name.toLocaleUpperCase()
  );
}

// --- Helpers ---
export const generateNewId = (): string =>
  (1e7 + -1e3 + -4e3 + -8e3 + -1e11)
    .toString()
    .replace(/[018]/g, (c) =>
      (
        Number(c) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
      ).toString(16)
    );

export const getPlatform = (): string => {
  const agent = navigator.userAgent.toLowerCase();
  if (agent.includes("windows")) return "Windows";
  if (agent.includes("mac")) return "macOS";
  if (agent.includes("linux")) return "Linux";
  if (agent.includes("android")) return "Android";
  if (agent.includes("iphone") || agent.includes("ipad")) return "iOS";
  return "Web";
};

export const createLoginFormData = (
  username: string | undefined,
  password: string | undefined
): LoginFormDataResult => {
  const device_id = generateNewId();
  const platform = getPlatform();
  const model_device =
    typeof navigator !== "undefined"
      ? navigator.platform || "unknown"
      : "unknown";
  localStorage.setItem("device_id", device_id);

  const formData = new FormData();

  const entries = {
    username: username || "",
    password: password || "",
    device: "web" as const,
    device_id,
    model_device,
    platform,
  } satisfies Record<string, string>;

  Object.entries(entries).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return { formData, device_id };
};

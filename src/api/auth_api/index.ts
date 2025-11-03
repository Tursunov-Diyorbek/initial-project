import API_V2 from "../V2";

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

// --- API Calls ---
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

export const loginUser = (loginData: FormData | LoginPayload) =>
  API_V2.post("/login", loginData);

export const refreshToken = (refresh_token: string, device_id: string) =>
  API_V2.post("/auth/refresh-token", { refresh_token, device_id });

// --- Helpers ---
export const generateNewId = (): string =>
  (1e7 + -1e3 + -4e3 + -8e3 + -1e11)
    .toString()
    .replace(/[018]/g, c =>
      (Number(c) ^
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

export const createLoginFormData = (username: string, password: string) => {
  const device_id = generateNewId();
  const platform = getPlatform();
  const model_device = navigator.platform || "unknown";

  const formData = new FormData();
  Object.entries({
    username,
    password,
    device: "web",
    device_id,
    model_device,
    platform,
  }).forEach(([key, value]) => formData.append(key, value));

  return { formData, device_id };
};

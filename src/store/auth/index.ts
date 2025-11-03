import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { QueryClient } from "@tanstack/react-query";
import SignIn from "./service";
const queryClient = new QueryClient();

export type TypeInitialStateAuth = {
  user?: any | null;
  error?: string;
  message?: string;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  permissions?: Array<string>;
  refreshLoading: boolean;
};

const initialState: TypeInitialStateAuth = {
  user: null,
  error: "",
  message: "",
  isAuthenticated: false,
  isLoading: false,
  permissions: [],
  refreshLoading: true,
};

const SignInSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.permissions = [""];
      state.user = {
        username: "username",
        access_token: "dfdsfdsfdfsfsd",
        name: "Jhone",
        surname: "Doe",
        middle_name: "Doe",
        permissions: [""],
        role: [],
        user_permissions: [],
        user_id: 1,
        guid: "",
        user_guid: "",
        gender: 1,
      };
    },

    logout(state) {
      state.isAuthenticated = false;
      state.message = "";
      state.error = "";
      state.permissions = [];
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      queryClient.clear();
    },
    
    loadingAuth(state) {
      state.refreshLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SignIn.fulfilled, (state, action: PayloadAction<any>) => {
        if (action.payload) {
          const user = action.payload.data.length ? action.payload.data[0] : action.payload.data;
          if (user.picture) {
            user.photo = user.picture;
          }

          state.user = user;
          state.message = action.payload.message;
          state.isLoading = false;
          state.isAuthenticated = true;
        } else {
          state.isLoading = false;
          state.isAuthenticated = false;
        }
      })
      .addCase(SignIn.rejected, (state, action: PayloadAction<any>) => {
        if (action?.payload?.data?.status === 0) {
          state.error = action.payload.data?.message;
          state.isLoading = false;
        } else {
          state.error = "disconnect";
          state.isLoading = false;
        }
      });
  },
});

export const { login, logout, loadingAuth } = SignInSlice.actions;

export default SignInSlice.reducer;

export type TUser = {
  id: string;
  password: string;
  needPasswordChange?: boolean;
  role: "student" | "faculty" | "admin";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
};

// export type TNewUser = {
//   password: string;
//   role: string;
//   id: string;
// };

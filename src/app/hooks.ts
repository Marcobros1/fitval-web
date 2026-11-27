import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// Como useDispatch y useSelector, pero con los tipos de nuestro store
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

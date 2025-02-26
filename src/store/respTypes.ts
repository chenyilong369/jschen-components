import { PageData, PageProps, ComponentData } from './editor'
import { ActionPayload } from './index'
export interface RespData<T = {}> {
  errno: number;
  data: T;
  message?: string;
  payload?: ActionPayload;
}
export interface ListData<T> {
  list: T[];
  count: number;
}
export interface WorkData extends Omit<PageData, 'props'> {
  content: {
    components: ComponentData[];
    props?: PageProps;
    setting?: any;
  };
}
export interface UploadData {
  url: string;
}
export type RespListData<T> = RespData<ListData<T>>
export type RespWorkData = RespData<WorkData>
export type RespUploadData = RespData<UploadData>
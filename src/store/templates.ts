import { Module } from "vuex";
import { actionWrapper, GlobalDataProps } from ".";
import axios from "axios";
import { RespData, RespListData } from "./respTypes";

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
  isHot: boolean;
  isNew: boolean;
}

export const testData: TemplateProps[] = [
  {
    id: 1,
    coverImg: "https://images.pexels.com/photos/27582996/pexels-photo-27582996/free-photo-of-a-statue-of-arco-da-rua-augusto-in-lisbon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    author: "jschen",
    copiedCount: 10,
    title: "sdasd1",
    isHot: true,
    isNew: true,
  },
  {
    id: 2,
    coverImg: "https://images.pexels.com/photos/27582996/pexels-photo-27582996/free-photo-of-a-statue-of-arco-da-rua-augusto-in-lisbon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    author: "jschen",
    copiedCount: 10,
    title: "sdasd",
    isHot: true,
    isNew: true,
  }, {
    id: 3,
    coverImg: "https://images.pexels.com/photos/27582996/pexels-photo-27582996/free-photo-of-a-statue-of-arco-da-rua-augusto-in-lisbon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    author: "jschen",
    copiedCount: 10,
    title: "sdasd",
    isHot: true,
    isNew: true,
  }
  , {
    id: 4,
    coverImg: "https://images.pexels.com/photos/27582996/pexels-photo-27582996/free-photo-of-a-statue-of-arco-da-rua-augusto-in-lisbon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    author: "jschen",
    copiedCount: 10,
    title: "sdasd",
    isHot: true,
    isNew: true,
  }
  , {
    id: 5,
    coverImg: "https://images.pexels.com/photos/27582996/pexels-photo-27582996/free-photo-of-a-statue-of-arco-da-rua-augusto-in-lisbon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    author: "jschen",
    copiedCount: 10,
    title: "sdasd",
    isHot: true,
    isNew: true,
  }
  , {
    id: 6,
    coverImg: "https://images.pexels.com/photos/27582996/pexels-photo-27582996/free-photo-of-a-statue-of-arco-da-rua-augusto-in-lisbon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    author: "jschen",
    copiedCount: 10,
    title: "sdasd",
    isHot: true,
    isNew: true,
  }
  , {
    id: 7,
    coverImg: "https://images.pexels.com/photos/27582996/pexels-photo-27582996/free-photo-of-a-statue-of-arco-da-rua-augusto-in-lisbon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    author: "jschen",
    copiedCount: 10,
    title: "sdasd",
    isHot: true,
    isNew: true,
  }
]

export interface TemplatesProps {
  totalTemplates: number;
  data: TemplateProps[];
  works: TemplateProps[];
  totalWorks: number;
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: testData,
    totalTemplates: 0,
    works: [],
    totalWorks: 0
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find(t => id === t.id)
    }
  },
  mutations: {
    fetchTemplates(state, rawData: RespListData<TemplateProps>) {
      const { count, list } = rawData.data
      state.data = [ ...state.data, ...(list || []) ]
      state.totalTemplates = count
    },
    fetchWorks(state, rawData: RespListData<TemplateProps>) {
      const { count, list } = rawData.data
      state.works = list
      state.totalWorks = count
    },
    fetchTemplate(state, rawData: RespData<TemplateProps>) {
      state.data = [rawData.data]
    }
  },  
  actions: {
    fetchTemplates: actionWrapper('/templates', 'fetchTemplates'),
    fetchWorks: actionWrapper('/works', 'fetchWorks'),
    fetchTemplate: actionWrapper('/templates/:id', 'fetchTemplate')
  }
}

export default templates

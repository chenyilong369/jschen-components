import { Module } from "vuex";
import { GlobalDataProps } from ".";

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
  data: TemplateProps[];
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: testData
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find(t => id === t.id)
    }
  }
}

export default templates

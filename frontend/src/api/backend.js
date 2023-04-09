import axios, {isCancel, AxiosError} from "axios";

const apiBaseUrl = "http://ec2-18-139-160-126.ap-southeast-1.compute.amazonaws.com:9191";

const apiAxios = new axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  // headers: {'X-Custom-Header': 'foobar'},
});

export class BackendApi {
  constructor() {}

  async getAllTopics() {
    try {
      const resp = await apiAxios.get(`topic/all`);
      return resp;
    } catch(error) {
      // throw error;
      console.log("");
      return {data: [{"doc_count":1,"last_modified_ts":1680949688,"tag_count":1,"topic_id":1,"topic_name":"fake"},{"doc_count":0,"last_modified_ts":1680951958,"tag_count":0,"topic_id":2,"topic_name":"\u6c38\u4e50\u5927\u5178\u6b63\u672c\u4e0b\u843d"},{"doc_count":0,"last_modified_ts":1680951958,"tag_count":0,"topic_id":3,"topic_name":"\u6469\u6258\u8f66\u6c7d\u4fee"}]};
    };
  }
  async getTopicNotes(topicId) {
    return apiAxios.get(`topic/${topicId}/notes`);
  }
  async getTopicTags(topicId) {
    return apiAxios.get(`topic/${topicId}/tags`);
  }
  async getTopicConversations(topicId) {
    // return apiAxios.get(`topic/${topicId}/conversations`);
    try {
      bad;
      const resp = await apiAxios.get(`topic/${topicId}/conversations`);
      return resp;
    } catch(error) {
      console.log("");
      return {data: [
        {
          conversation_id: 1,
          conversation_type: "question",
          doc_id: 2,
          question: "五六七八",
          answer: "一二三四",
          next_keywords: ["为什么", "好的呀", "东南西看看情况", "东南西看看情况", "东南西看看情况", "东南西看看情况"],
          tags: [{"id": 1, "name": "好呀"}],
          last_modified_ts: 1680951958,
        },
        {
          conversation_id: 1,
          conversation_type: "summary",
          doc_id: 2,
          question: "五六七八",
          answer: "一二三四",
          next_keywords: ["为什么", "好的呀", "东南西看看情况", "东南西看看情况", "东南西看看情况", "东南西看看情况"],
          tags: [{"id": 1, "name": "好呀"}],
          last_modified_ts: 1680951958,
        },
        {
          conversation_id: 1,
          conversation_type: "full",
          doc_id: 2,
          question: "五六七八",
          answer: (`${"一二三四一二三四，一二三四".repeat(10)}。\n`.repeat(10)),
          next_keywords: ["为什么", "好的呀", "东南西看看情况", "东南西看看情况", "东南西看看情况", "东南西看看情况"],
          tags: [{"id": 1, "name": "好呀"}],
          last_modified_ts: 1680951958,
        },
      ]};
    };
  }


  async createNewTag(topicId, tag_name) {
    const resp = await apiAxios.post(`tag/create`, {
      topic_id: topicId,
      tag_name
    });
    return resp;
  }
  async createNewNote(topic_id, conversation_id, text, text_start, text_end, comment) {
    // topic_id: Required
    // conversation_id: Optional,
    // text: Option String
    // text_start: Optional Int
    // text_end: Optional Int
    // comment: String

    const resp = await apiAxios.post(`note/create`, {
      topic_id, conversation_id, text, text_start, text_end, comment
    });
    return resp;
  }






  async getTagDocuments(tagId) {}
  async getDocumentAbstract(docId) {}
  async getDocumentFullContent(docId) {}
  async chat(content) {}
};

export const backendApi = new BackendApi();

// export BackendApi;
// export backendApi;


class FakeBackendApi {
  constructor() {}
  async getAllTopics() {
    const fakeData = [
      {
        topic_id: "awgasfg",
        name: "永乐大典正本下落",
        doc_count: 112,
        tag_count: 216,
      },
      {
        topic_id: "dsbesfa",
        name: "VR storytelling",
        doc_count: 341,
        tag_count: 124,
      },
      {
        topic_id: "gbyhgag",
        name: "Search as Learning & ChatGPT",
        doc_count: 32,
        tag_count: 16,
      },
    ];
    return fakeData;
  }
  async getTopicTags(topicId) {
    const fakeData = [
      {
        tag_id: "00",
        name: "永乐大典",
        doc_count: 32,
      },
      {
        tag_id: "01",
        name: "明朝",
        doc_count: 32,
      },
      {
        tag_id: "02",
        name: "朱棣",
        doc_count: 32,
      },
      {
        tag_id: "03",
        name: "永陵",
        doc_count: 32,
      },
      {
        tag_id: "04",
        name: "李自成",
        doc_count: 32,
      },
      {
        tag_id: "05",
        name: "百科全书",
        doc_count: 32,
      },
      {
        tag_id: "06",
        name: "校勘学",
        doc_count: 32,
      },
      {
        tag_id: "07",
        name: "类书",
        doc_count: 32,
      },
      {
        tag_id: "08",
        name: "四库全书",
        doc_count: 32,
      },
    ];
    return fakeData;
  }
  async getTopicConversations(topicId) {
    const fakeData = [
      {
        conversation_id,
        type,
        doc_id,
        question,
        answer,
        next_keywords: [],
        tags: [],
      },
    ];
    return fakeData;
  }
  async getTagDocuments(tagId) {
    const fakeData = [
      {
        doc_id,
        title,
      },
    ];
    return fakeData;
  }

  async getAllNotes() {
    const fakeData = [
      {
        topic_id: "sfgasrg",
        conversation_id: "dafgrwga",
        note_id: "耶耶",
        text: "String",
        text_start: 2,
        text_end: 4,
        comment: "哈哈",
        last_modified_ts: 4123,
      },
    ];
    return fakeData;
  }
  async createChat(content) {
    const {
      type,  // Full/Summary/Question,
      doc_id,
      question,
    } = content;
    const fakeData = {
      conversation_id,
      type,
      doc_id,
      question,
      answer,
      next_keywords: [],
      tags: [],
    };
    return fakeData;
  }
  async createNote(content) {
    const {
      // topic_id: Required
      // conversation_id: Optional,
      // Note_id: Optional
      //   text_start: Optional Int
      //   text_end: Optional Int
      //   comment: Strint
    } = content;
    const fakeData = {
      topic_id: "sfgasrg",
      conversation_id: "dafgrwga",
      note_id: "耶耶",
      text: "String",
      text_start: 2,
      text_end: 4,
      comment: "哈哈",
      last_modified_ts: 4123,
    };
    return fakeData;
  }

  async createTag(req) {
    const {
      tag_name,
    } = req;
    const fakeData = {
      tag_id: "sfgar",
      tag_name: "aggra",
      doc_count: 0,
    };
    return fakeData;
  }


  // async getDocumentAbstract(docId) {}

  // async getDocumentFullContent(docId) {}


  // async chat(content) {}
}

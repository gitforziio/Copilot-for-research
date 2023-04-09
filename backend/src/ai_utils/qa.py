import os
import openai
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.document_loaders import TextLoader
openai_api_key = "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"
openai.api_key = openai_api_key
index_name = "ydwh-openai-langchain-1000-800"
import pinecone 
# initialize pinecone
pinecone.init(
    api_key="66ec8be5-8c91-4005-9159-e5f25e0f54a7",  # find at app.pinecone.io
    environment="asia-southeast1-gcp"  # next to api key in console
)
## batch upload vectors
def enhance_vector(dir_path,index_name):
    file_list = glob.glob(f"{dir_path}/*.txt")
    chunk_size = 1000
    chunk_overlap = 800
    index_name = index_name
    embeddings = OpenAIEmbeddings(openai_api_key = openai_api_key, model = "text-embedding-ada-002")

    for complete_file_path  in file_list:
        loader = TextLoader(complete_file_path)
        documents = loader.load()
        text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap,separator = "\n")
        docs = text_splitter.split_documents(documents)
        docsearch = Pinecone.from_documents(docs, embeddings, index_name=index_name)
    return True

def query_enhancement(query):
    completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": """
        你是一个人文研究者的助手。
        请根据提供的问题或陈述，改写或扩写成一个详细且具有更高相关性的问题或陈述，同时考虑可能涉及到的历史、文化、地理和政治背景，以便在与海量文本做相似度匹配时找到最相关的答案。
        
        """},
        {"role": "user", "content": query}
    ]
    )

    return completion.choices[0].message['content']

def doc_search(query,index_name,k=1):
    embeddings = OpenAIEmbeddings(openai_api_key = openai_api_key, model = "text-embedding-ada-002")
    docsearch = Pinecone.from_existing_index(index_name=index_name, embedding=embeddings)
    results = docsearch.similarity_search(query, k=k)
    return results

def get_contextbased_answer_notlangchain(context,question):
    prompt_template = """
    请使用以下背景信息来回答最后的问题。如果你不知道答案，请说“根据当前的文档集，无法得出相关信息。这里只提供最相关的文档”。
    请用中文回答。
    {context}
    问题：{question}
    有帮助的答案："""
    completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": prompt_template.format(context=context,question = question)}
    ]
    )

    return completion.choices[0].message['content']



def get_answer(question, index_name = index_name, mode = 'langchain'):
    results = doc_search(question, index_name)
    llm = OpenAI(temperature=0, openai_api_key=openai_api_key)
    if mode == 'langchain':
        chain = load_qa_chain(llm, chain_type="stuff")
        answer = chain.run(input_documents=results, question=question)
    else:
        answer = get_contextbased_answer_notlangchain(results[0].page_content,question)
    follow_up = get_followup_keywords(question,answer,results[0].page_content)
    return results[0].metadata['source'], answer, follow_up

def get_followup_keywords(question,answer,context):
    prompt_template = """
    假设你是一个古汉语古文献领域的研究者。请根据你的知识和关注重点，根据以下的背景文本，以及上一轮的问答，提出5个接下来想继续深入研究的实体，每个限制6个字以内。
    背景文本：
    ----
    {context}
    ----
    上一轮问题：{question}
    上一轮回答：{answer}
    
    输出格式如下：
    序号:词或短语
    """
    completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": prompt_template.format(context=context,question = question,answer = answer)}
    ]
    )

    return completion.choices[0].message['content']

def ai_answer(question,mode = 'langchain'):
    path, answer,follow_up = get_answer(question,mode = mode)
    file_name = path.split("/")[-1]
    follow_ups = [x.split(": ")[-1] for x in follow_up.split("\n")]
    return {"file_name":file_name, "answer":answer,"follow_up":follow_ups}
if __name__ == "__main__":
    # enhance_vector(dir_path = "data",index_name = index_name)
    print(ai_answer("《永乐大典》的成书时间是？"))
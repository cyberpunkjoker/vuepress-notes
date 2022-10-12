<template>
  <div class="title"> indexDB 功能展示 </div>
  <div v-if="state.visible" class="modal">
    <div> {{ state.status === 'edit' ? '修改' : '新建' }} </div>
    name: <input :value="state.name" type="text" @change="(e) => changeValue(e, 'name')">
    email: <input :value="state.email" type="text" @change="(e) => changeValue(e, 'email')">
    describe: <input :value="state.describe" type="text" @change="(e) => changeValue(e, 'describe')">
    <div class="btn" @click="onSubmit">提交</div>
  </div>

  <div class="msgList">
    <div class="btn" @click="() => openModal('add')">添加用户信息</div>
    <div class="btn" @click="addDefalutInfo">添加默认展示</div>
    <div 
      v-for="item in state.allMsgList" 
      :key="item.ssn"
      class="msgListItem"
    >
      <span>姓名: {{item.name}}</span>
      <span>邮件: {{item.email}}</span>
      <span>描述: {{item.describe}}</span>
      <span>code: {{item.code}}</span>

      <div class="btn" @click="() => openModal('edit', item)">修改信息</div>
      <div class="btn" @click="() => delItem(item.ssn)">删除信息</div>
    </div>
  </div>  
  
</template>

<script lang="ts" setup>
  import { onMounted, ref, reactive } from 'vue'
  import IndexedDB from './common/indexDB'

  interface IProps {
    allMsgList: any[],
    visible: boolean,
    status: 'edit' | 'add',
    name: string,
    email: string,
    describe: string,
    curItem: object,
  }

  const storeParams = [
    { name: 'name', uni: false },
    { name: 'email', uni: false },
    { name: 'describe', uni: false },
    { name: 'code', uni: true },
  ]
  const STORE_NAME = 'customers'
  const defaultData = [
    {
      "name": "saierda",
      "email": "ewewe@gg.com",
      "describe": "ssdadqwd",
      "code": "131",
      "ssn": 22
    },
    {
      "name": "ycee",
      "email": "1we33@gmail.com",
      "describe": "123descdc",
      "code": "151",
      "ssn": 234
    },
    {
      "name": "yahaha",
      "email": "123123@qq.com",
      "describe": "ewewewe",
      "code": "111",
      "ssn": 2234
    }
  ]

  const dbInstance = ref(null)
  const state = reactive<IProps>({
    allMsgList: [],
    visible: false,
    status: 'add',
    name: '',
    email: '',
    describe: '',
    curItem: {},
  })

  onMounted(() => {
    const db = new IndexedDB({
      dbName: 'myDB',
      version: 1,
      paramsList: storeParams,
      storeName: STORE_NAME,
      keyPath: 'ssn',
    })

    db.openDB().then(res => {
      getAllList()
    })

    dbInstance.value = db
  
  })

  const getAllList = async() => {
    const list = await dbInstance.value.queryAllData()
    state.allMsgList = list
  }

  const addDefalutInfo = async () => {
    const res = await dbInstance.value.addData(defaultData)

    if (res.allPassed) {
      console.log('添加成功all');
    } else {
      const failed = res.failedIds.join(',')
      console.log('添加失败->', failed);
    }
    getAllList()
  }

  const openModal = (val:'edit'|'add', item: any) => {
    if (val === 'edit') {
      state.curItem = item
      state.name = item.name
      state.email = item.email
      state.describe = item.describe
    }
    state.status = val
    state.visible = true
  }

  const changeValue = (e: any, val: string) => state[val] = e.target.value

  const onSubmit = async() => {
    const isEditSts = state.status === 'edit'
    const { name, email, describe } = state
    
    if (isEditSts) {
      const { ssn, code } = state.curItem || {}
      const params = { name, email, describe, ssn, code }
      await dbInstance.value.updateData(params)
      getAllList()
    } else {
      const ssn = state.allMsgList.length + 1
      const code = Math.random()
      const params = [{ name, email, describe, ssn, code }]
      const res = await dbInstance.value.addData(params)
      if (res.allPassed) {
        getAllList()
      } else {
        console.log('添加失败');
      }
    }
    
  }

  const delItem = async(ssn: string) => {
    await dbInstance.value.delData(ssn)
    getAllList()
  }

</script>

<style lang="less" scoped>
  .title {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 50px;
    background: skyblue;
    font-size: 18px;
    font-weight: 600;
  }
  
  .modal {
    margin: 10px 0;
    padding: 10px;
    border: 1px dashed #ccc;
  }
  .msgList {
    border: 1px solid #eee;
    border-radius: 10px;
    .msgListItem {
      border-top: 1px solid #eee;
      span {
        margin: 4px 10px;
      }
    }
  }

  .btn {
    display: inline-block;
    margin: 0 10px;
    color: sienna;
    cursor: pointer;
  }
  
</style>
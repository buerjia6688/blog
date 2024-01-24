---
keywords: 'useTable,useForm,table封装,表格,封装,表格封装,Vue3,elementplus'
---

# 表格封装之 useTable 封装

在日常开发中，后端管理系统中增删改查的开发大多是重复机械式的工作，为了减少解放自己的双手，我们可以对这部分工作的内容进行封装。

上篇记录了 [表格封装之 useForm 封装](/docs/study/web/use-form)，本篇将记录如何封装 `useTable` 表格。

::: tip

- 本文基于 Vue3、TypeScript、ElementPlus 进行封装。

- 本文中不便于描述的功能在代码示例中注释标注。

:::

## 封装 Hook

封装一个表格，我们需要满足基本的表格的查询，渲染，分页，以及分页等操作。

```typescript
import { reactive, toRefs } from 'vue'

/**
 * 分页
 */
interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

/**
 * 定义数据
 */
interface TableState {
  pagination: Pagination
  loading: boolean
  data: any[]
}

// 调用参数
interface UseTableProps {
  api: (params: any) => Promise<any>
  query?: any
  formatter?: (data: any[]) => any[]
}

/**
 *
 * @param api 请求接口
 * @param query 查询默认参数
 * @param formatter 格式化表格数据
 * @returns
 */
export const useTable = ({ api, query = {}, formatter }: UseTableProps) => {
  const state = reactive<TableState>({
    loading: true,
    data: [],
    pagination: {
      currentPage: 1,
      pageSize: 20,
      total: 0,
    },
  })

  // 查询数据
  async function initQueryData() {
    const v = await api({
      page: state.pagination.currentPage,
      page_size: state.pagination.pageSize,
      ...query,
    })
    state.loading = false
    const { data, total, current_page } = v
    // 需要格式化数据
    state.data = formatter ? formatter(data) : data
    // 分页的数据
    state.pagination.total = total
    state.pagination.currentPage = current_page
  }

  // 分页请求
  function onChangePage(page: number) {
    state.loading = true
    state.pagination.currentPage = page
    initQueryData()
  }

  // 分页大小Change
  function onChangeSize(size: number) {
    state.loading = true
    state.pagination.pageSize = size
    initQueryData()
  }

  // 搜索
  function onSearch() {
    state.loading = true
    state.pagination.currentPage = 1
    initQueryData()
  }

  // 重置搜索
  function onReset() {
    state.loading = true
    state.pagination.currentPage = 1
    initQueryData()
  }

  // 刷新
  function onRefresh() {
    state.loading = true
    initQueryData()
  }

  // 初始化请求
  initQueryData()

  return {
    ...toRefs(state),
    onChangePage,
    onChangeSize,
    onSearch,
    onReset,
    onRefresh,
  }
}
```

在以上的封装中，我们可以获取到表格的数据、分页的数据以及各种通用的函数。

```vue
<script lang="ts" setup>
import { h } from 'vue'
import { apiGetList } from '@/api/index'

const formValue = ref({
  id: '',
})

const { data, loading, pagination, onChangePage, onChangeSize, onSearch, onReset, onRefresh } =
  useTable({ api: apiGetList, query: formValue.value })
</script>
```

## 封装组件

基于 useTable 返回的参数，我们需要封装组件，实现 Table 和分页的功能。

```vue
<template>
  <el-card shadow="never">
    <el-table ref="multipleTableRef" v-loading="loading" :data="data" :border="true" fit>
      <el-table-column
        v-for="(item, i) in column"
        :key="i"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :min-width="item.minWidth"
        :fixed="item.fixed"
        :align="item.align"
        :formatter="item.formatter"
        :show-overflow-tooltip="item.tooltip"
      >
        <template #default="scope" v-if="item.render">
          <component :is="RenderComponent(item.render(scope.row))" />
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[20, 50, 100, 200, 500]"
        :layout="['total', 'sizes', 'prev', 'pager', 'next', 'jumper']"
        :total="pagination.total"
        @size-change="onChangeSize"
        @current-change="onChangePage"
      />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
import { useTable } from './hooks'

interface TableProps<T> {
  api: (params: any) => Promise<any>
  query?: object
  formatter?: (data: T[]) => T[]
  column: any[]
}

const props = defineProps<TableProps<any>>()

const { data, loading, pagination, onChangePage, onChangeSize, onSearch, onReset, onRefresh } =
  useTable({ api: props.api, query: props.query, formatter: props.formatter })

// 暴露方法给外部组件
defineExpose({
  onSearch,
  onReset,
  onRefresh,
})

// 渲染组件包装层
const RenderComponent = (component: any) => {
  if (typeof component === 'object' && component.type) {
    return component
  }
  return h('div', component)
}
</script>
```

## 运用

此时我们已经完成了 Table 的封装，我们仅通过一下的运用就可以轻松的完成表格的查询、分页等操作。

```vue
<template>
  <Table :query="formValue" :api="apiGetList" :column="column" />
</template>
<script lang="ts" setup>
import Table from '@/hooks/useTable'
import { apiGetList } from '@/api/index'

const column = reactive([
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: '名称' },
])
</script>
```

## 总结

封装 `useTable` 可以实现基于配置化得到 `data` `loading` `pagination` `onChangePage` `onChangeSize` `onSearch` `onReset` `onRefresh` 。

基于 `useTable` 的结果封装 `Table` 组件。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

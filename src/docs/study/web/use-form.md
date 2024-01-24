---
keywords: 'useTable,useForm,table封装,表格,封装,表格封装,Vue3,elementplus'
---

# 表格封装之 useForm 封装

在日常开发中，后端管理系统中增删改查的开发大多是重复机械式的工作，为了减少解放自己的双手，我们可以对这部分工作的内容进行封装。

一般的增删改查页面，由顶部搜索区，中部表格区，底部功能区（分页、多选等）三部分组成，我们将分文三个部分进行封装处理、本篇文章我们将实现 `useForm` 及组价的封装。

::: tip

- 本文基于 Vue3、TypeScript、ElementPlus 进行封装。

- 本文中不便于描述的功能在代码示例中注释标注。

:::

## 封装目标

`useForm` 是对顶部搜索区域的封装，通过封装基于配置化实现表单的渲染，同时实现数据项的双向绑定和自定义插槽的功能。

如下示例代码为我们的目标实现

```vue
<template>
  <Form v-model="formValue" :column="column" @search="onSearch">
    <el-button type="default" @click="onReset">重置</el-button>
  </Form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import Form, { useForm, FormItem } from '@/hooks/useForm'

const _column = reactive<FormItem[]>([
  { type: 'input', prop: 'id', label: 'ID' },
  {
    type: 'select',
    prop: 'sex',
    label: '性别',
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 0 },
    ],
  },
])

const { formValue, column, onReset } = useForm(_column)
const onSearch = () => {}
</script>
```

## 定义类型

既然是封装表单，我们需要考虑存在那些组件以及组件的特殊属性，比如以下的示例中定义了 `Input 输入` `Date 时间` `Select 下拉` `Cascader 级联` `Slot 自定义` 组件，当然你也可以根据具体的业务而进行修改。

```typescript
// /hooks/useForm/type.d.ts
import type { VNodeChild } from 'vue'

/**
 * 表单默认配置
 */
interface FormDefault {
  label: string
  placeholder?: string
}

/**
 * 输入框
 */
export interface FormInput extends FormDefault {
  type: 'input'
  prop: string
  value?: string
  dataType?: 'number' | 'string'
}

/**
 * 日期时间选择器
 */
interface FormDateDefault extends FormDefault {
  type: 'date'
  prop: string
  dateType?: 'date' | 'datetime'
  valueFormat?: string
  value?: string
}

interface FormDateRange extends FormDefault {
  type: 'date'
  dateType: 'daterange'
  prop: [string, string]
  value?: [string, string] | null
}

export type FormDate = FormDateDefault | FormDateRange

/**
 * 下拉框
 */
export interface FormSelect1 extends FormDefault {
  type: 'select'
  prop: string
  multiple?: boolean
  value?: string | number
  options: any[]
  labelKey?: string | 'label'
  valueKey?: string | 'value'
}
export interface FormSelect2 extends FormDefault {
  type: 'select'
  prop: string
  multiple?: boolean
  value?: string | number
  api: (any) => Promise<any>
  labelKey?: string | 'label'
  valueKey?: string | 'value'
}
export interface FormSelect3 extends FormDefault {
  type: 'select'
  prop: string
  multiple?: boolean
  value?: string | number
  searchApi: (any) => Promise<any>
  labelKey?: string | 'label'
  valueKey?: string | 'value'
}

export type FormSelect = FormSelect1 | FormSelect2 | FormSelect3

/**
 * 级联选择器
 */
interface FormCascader1 extends FormDefault {
  type: 'cascader'
  prop: string
  multiple?: boolean
  value?: string | number
  options: any[]
  labelKey?: string | 'label'
  valueKey?: string | 'value'
  childrenKey?: string | 'children'
}

interface FormCascader2 extends FormDefault {
  type: 'cascader'
  prop: string
  multiple?: boolean
  value?: string | number
  api: (any) => Promise<any>
  labelKey?: string | 'label'
  valueKey?: string | 'value'
  childrenKey?: string | 'children'
}

export type FormCascader = FormCascader1 | FormCascader2

/**
 * 自定义组件
 */
export interface FormSlot extends FormDefault {
  type: 'slot'
  prop: string[] | string
  value?: any
  render: (row: any) => VNodeChild
}

/**
 * 表单合集
 */
export type FormItem = FormInput | FormDate | FormSelect | FormCascader | FormSlot
```

## 封装 Hook

根据组件的功能属性进行初始化处理，拿到初始的表单值、对表单项的配置进行初始化，以及封装通用的函数。

```typescript
// /hooks/useForm/hooks.ts
import { reactive, toRefs } from 'vue'
import { FormItem } from './types.d'
import { isEmpty } from '@/utils/utils'

interface FormParams {
  formValue: any
}

export const useForm = (column: FormItem[]) => {
  const state = reactive<FormParams>({
    formValue: {},
  })

  // 拿到初始化 formValue 的值
  function initForm() {
    column.forEach(async item => {
      // 下拉框
      if (item.type === 'select') {
        const { prop, options, api, searchApi } = item as any

        // 字段检验
        if (isEmpty(api) && isEmpty(options) && isEmpty(searchApi)) {
          console.warn(`[useForm] ${prop} 字段配置 api 、searchApi 或 options 不能同时为空`)
          return
        }

        const _options: any[] = options || []
        ;(item as any).options = _options
        state.formValue[item.prop] = item.value || null

        // 下拉框的选项可能来自于远程，在这里获取
        if (api) {
          let v = await api({})
          // 返回的结果可能格式不一致，兼容处理
          v instanceof Array && (v = { total: v.length, data: v })
          ;(item as any).options = _options.concat(v.data)
          state.formValue[item.prop] = item.value || null
        }

        return
      }

      // 级联选择器
      if (item.type === 'cascader') {
        const { prop, options, api } = item as any

        // 字段检验
        if (isEmpty(api) && isEmpty(options)) {
          console.warn(`[useForm] ${prop} 字段配置 api 或 options 不能同时为空`)
          return
        }

        const _options: any[] = options || []
        ;(item as any).options = _options
        state.formValue[item.prop] = item.value || null

        // 级联选择器的选项可能来自于远程，在这里获取
        if (api) {
          let v = await api({})
          // 返回的结果可能格式不一致，兼容处理
          v instanceof Array && (v = { total: v.length, data: v })
          ;(item as any).options = _options.concat(v.data)
          state.formValue[item.prop] = item.value || null
        }

        return
      }

      // 时间
      if (item.type === 'date') {
        const { dateType } = item
        // 时间区间可能为两个字段
        if (dateType === 'daterange') {
          state.formValue[item.prop[0]] = item.value ? item.value[0] : null
          state.formValue[item.prop[1]] = item.value ? item.value[1] : null
          return
        }
        state.formValue[item.prop as string] = item.value || null
        return
      }

      // 自定义
      if (item.type === 'slot') {
        if (item.prop instanceof Array) {
          item.prop.forEach((v: string, i: number) => {
            state.formValue[v] = (item.value && item.value[i]) || null
          })
          return
        }
      }
      state.formValue[item.prop as string] = item.value || null
    })
  }

  // 重置表单时间
  function onReset() {
    column.forEach((item: any) => {
      // 时间区间
      if (item.type === 'daterange') {
        state.formValue[item.prop[0]] = null
        state.formValue[item.prop[1]] = null
        item.value = void 0
        return
      }
      // 时间区间
      if (item.type === 'time') {
        state.formValue[item.prop] = null
        item.value = void 0
        return
      }
      // 自定义
      if (item.type === 'slot') {
        if (item.prop instanceof Array) {
          item.prop.forEach((v: string) => {
            state.formValue[v] = null
          })
          return
        }
      }
      state.formValue[item.prop as string] = null
    })
  }

  // 初始化
  initForm()

  return {
    ...toRefs(state),
    column,
    onReset,
  }
}
```

::: tip

- formValue

  基于表单项拿得初始化的表单值，也就是原始值，可用于表单的数据双向绑定或提供给外部使用。

- column

  对表单项进行初始化，对一些需要从接口中获取数据的组件进行请求处理。

- onReset

  通用函数，重置表单。

:::

## 渲染组件

通过 `useForm()` 我们可拿到 `formValue` `column` `onReset`，接下来我们基于以上参数进行组件的封装。

```vue
<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="modelValue" label-width="auto">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="(prop, i) in column" :key="i">
          <el-form-item :label="prop.label">
            <template v-if="prop.type === 'input'">
              <template v-if="prop.dataType === 'number'">
                <el-input-number
                  v-model="modelValue[prop.prop]"
                  :placeholder="prop.placeholder || `请输入${prop.label}`"
                  controls-position="right"
                  @change="emits('search')"
                  @keyup.enter="emits('search')"
                />
              </template>
              <template v-else>
                <el-input
                  v-model="modelValue[prop.prop]"
                  :placeholder="prop.placeholder || `请输入${prop.label}`"
                  clearable
                  @blur="emits('search')"
                  @keyup.enter="emits('search')"
                />
              </template>
            </template>

            <template v-if="prop.type === 'date'">
              <template v-if="prop.dateType === 'daterange'">
                <el-date-picker
                  v-model="prop.value"
                  :type="prop.dateType"
                  clearable
                  start-placeholder="起始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  @change="(v: [Date, Date] | null) => handleChangeDateRange(v, prop.prop)"
                />
              </template>
              <template v-else>
                <el-date-picker
                  v-model="modelValue[prop.prop]"
                  :type="prop.dateType || 'date'"
                  clearable
                  :placeholder="prop.placeholder || `请选择${prop.label}`"
                  :value-format="prop.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
                  @change="emits('search')"
                />
              </template>
            </template>
            <template v-if="prop.type === 'select'">
              <el-select-v2
                v-model="modelValue[prop.prop]"
                :props="{
                  label: prop.labelKey || 'label',
                  value: prop.valueKey || 'value',
                }"
                filterable
                clearable
                :remote="!!(prop as any).searchApi"
                :loading="(prop as any).loading"
                :remote-method="(v: string | null) => handleRemoteMethod(v, prop)"
                :multiple="prop.multiple"
                :options="(prop as any).options"
                :placeholder="prop.placeholder || `请选择${prop.label}`"
                @change="emits('search')"
              />
            </template>
            <template v-if="prop.type === 'cascader'">
              <el-cascader
                v-model="modelValue[prop.prop]"
                :props="{
                  multiple: prop.multiple,
                  emitPath: false,
                  label: prop.labelKey || 'label',
                  value: prop.valueKey || 'value',
                  children: prop.childrenKey || 'children',
                }"
                :options="(prop as any).options"
                clearable
                @change="emits('search')"
              />
            </template>
            <template v-if="prop.type === 'slot'">
              <component :is="RenderComponent(prop.render(modelValue))" />
            </template>
          </el-form-item>
        </el-col>

        <!-- 判断是否存在 default slot -->
        <template v-if="$slots.default">
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item>
              <slot />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { h } from 'vue'
import dayjs from 'dayjs'
import type { FormItem } from './types.d'

const emits = defineEmits<{
  'update:modelValue': [val: any]
  search: []
  reset: []
}>()

interface Props {
  modelValue: any
  column: FormItem[]
}

const props = defineProps<Props>()

/**
 * 日期范围选择器切换事件
 * @param {Date} val 日期范围
 * @param {string} prop 日期范围对应的字段
 */

const handleChangeDateRange = (val: [Date, Date] | null, prop: [string, string]) => {
  const [start, end] = val || [null, null]
  props.modelValue[prop[0]] = start
  // 结束时间默认添加1天
  props.modelValue[prop[1]] = dayjs(end).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  emits('update:modelValue', props.modelValue)
  emits('search')
}

/**
 * 搜索结果
 * @param val 搜索关键字
 * @param item 表单项
 */
const handleRemoteMethod = async (val: string | null, item: any) => {
  if (!item.searchApi) return
  !val && (item.options = [])
  if (!val) return
  item.loading = true
  const v = await item.searchApi({ name: val })
  item.loading = false
  item.options = v.data
}

// 渲染组件包装层
const RenderComponent = (component: any) => {
  // 判断 component 是否是一个h函数
  if (typeof component === 'object' && component.type) {
    return component
  }

  // 数组、字符串
  return h('div', component)
}
</script>
```

## 总结

封装 `useForm` 可以实现基于配置化得到 `formValue` 、`column` 、`onReset` 。

基于 `useForm` 的结果封装 `Form` 组件。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

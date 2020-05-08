import BasicCheckbox from '../components/checkbox/BasicCheckbox.vue'
import DisabledCheckbox from '../components/checkbox/DisabledCheckbox.vue'
import CheckboxGroup from '../components/checkbox/CheckboxGroup.vue'
import CheckboxButton from '../components/checkbox/CheckboxButton.vue'

import { action } from '@storybook/addon-actions'

// This is required for each story
export default { title: 'Checkbox' }

// Customize components here. For instance, here's my-button component with a text of "with text"
export const basicCheckbox = () => ({
  components: { BasicCheckbox },
  template: `
  <div>
    <basic-checkbox @click="action" 
      class="body-reg"
    >
      Checkbox A
    </basic-checkbox>
  </div>  
  `,
  methods: { action: action('click') }
})

export const disabledCheckbox = () => ({
  components: { DisabledCheckbox },
  template: `
    <div>
      <disabled-checkbox @click="action"
        class="body-reg"
      >
        Checkbox A
      </disabled-checkbox>
    </div>  
    `,
  methods: { action: action('click') }
})

export const checkboxGroup = () => ({
  components: { CheckboxGroup },
  data () {
    return {
      checkList: ['Selected and disabled', 'Option A']
    }
  },
  template: `
    <div>
      <checkbox-group 
        v-model="checkList"
        class="body-reg"
      >
      <el-checkbox label="Option A"></el-checkbox>
      <el-checkbox label="Option B"></el-checkbox>
      <el-checkbox label="Option C"></el-checkbox>
      <el-checkbox label="Disabled" disabled></el-checkbox>
      <el-checkbox label="Selected and disabled" disabled></el-checkbox>
      </checkbox-group>
    </div>  
    `
})

export const checkboxButton = () => ({
  components: { CheckboxButton },
  template: `
      <div>
        <checkbox-button 
          size="size"
          class="body-reg"
          round>
        </checkbox-button>
      </div>
      `,
  methods: { action: action('click') }
})

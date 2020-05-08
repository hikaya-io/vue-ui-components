import BasicDrawer from '../components/drawer/BasicDrawer.vue'

// This is required for each story
export default { title: 'Drawer' }

// Customize components here.
export const basicDrawer = () => ({
  components: { BasicDrawer },
  data () {
    return {
      drawer: false,
      direction: 'rtl',
      title: 'I am the title'
    }
  },
  template: `
  <div>
    <el-button 
      @click="drawer = true"
      type="primary"
      style="margin-left: 16px;"
    >
      Open drawer
    </el-button>
    <basic-drawer
      :title="title"
      :visible.sync="drawer"
      :direction="direction"
      size="48%"
      :show-close="false"
      :wrapper-closable="true"
      :modal="false"
      class="body-bold"
    >
      <span
        class="body-reg"
      >
        Hi, there!
      </span>
    </basic-drawer>
  </div>
  `
})

export const drawerWithoutTitle = () => ({
  components: { BasicDrawer },
  data () {
    return {
      drawer: false,
      direction: 'ltr',
      title: 'I am the title'
    }
  },
  template: `
    <div>
      <el-button 
        @click="drawer = true"
        type="primary"
        style="margin-left: 16px;"
      >
        Open drawer
      </el-button>
      <basic-drawer
        :title="title"
        :visible.sync="drawer"
        :direction="direction"
        :with-header="false"
        size="48%"
        class="body-bold"
        :modal="false"
      >
        <span
          class="body-reg"
        >
          Hi, there!
        </span>
      </basic-drawer>
    </div>
    `
})

export const drawerNotClosableOnClick = () => ({
  components: { BasicDrawer },
  data () {
    return {
      drawer: false,
      direction: 'rtl',
      title: 'I am the title'
    }
  },
  template: `
      <div>
        <el-button 
          @click="drawer=true"
          type="primary"
          style="margin-left: 16px;"
        >
          Open drawer
        </el-button>

        <basic-drawer
          :title="title"
          :visible.sync="drawer"
          :direction="direction"
          size="48%"
          :wrapper-closable="false"
          :modal="false"
          class="body-bold"
        >
          <span
            class="body-reg"
          >
            Hi, there!
          </span>
        </basic-drawer>
      </div>
      `
})

export const doubleDrawer = () => ({
  components: { BasicDrawer },
  data () {
    return {
      drawerRight: false,
      drawerLeft: false,
      title: 'I am the title'
    }
  },
  template: `
  <div>
    <el-button 
      @click="drawerRight = true"
      type="primary"
    >
      Open right drawer
    </el-button>
    <basic-drawer
      :title="title"
      :visible.sync="drawerRight"
      direction="rtl"
      size="48%"
      :show-close="false"
      :wrapper-closable="true"
      :modal="false"
      :modal-append-to-body="false"
      class="body-reg"
    >
      <span>Hi, there!</span>
      <el-button
        @click="drawerLeft = true"
        type="primary"
      >
      Open left drawer
      </el-button>
    </basic-drawer>
    <basic-drawer
      :title="title"
      :visible.sync="drawerLeft"
      direction="ltr"
      size="48%"
      :show-close="true"
      :wrapper-closable="true"
      :modal="true"
      class="body-reg"
      :modal="false"
    >
      <span>Hi, there!</span>
    </basic-drawer>
  </div>
  `
})

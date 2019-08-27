<template>
  <el-row class="title clearBoth">
    <el-col :span="1" class="left">
      <img
        class="headImg"
        v-if="queryData.personType == 'QGS' ||
        (queryData.personType == 'ZDFW' && queryData.persons && queryData.persons.length > 1)"
        src="./../../assets/img/je-headImg.jpg"
      />
      <div class="label" v-html="photoPath" v-else></div>
    </el-col>
    <el-col :span="1.5" class="left ">
      <span v-if="queryData.personType == 'QGS'">全公司</span>
      <span v-if="queryData.personType !== 'QGS' && queryData.persons.length == 1">{{ queryData.persons[0].name }}</span>
      <span v-if="queryData.personType !== 'QGS' && queryData.persons.length > 1">{{ queryData.persons.length}}个员工</span>
    </el-col>
    <el-col :span="1" class="left">
      <el-dropdown
        trigger="click"
        @command="personTypeSelect"
      >
        <span style="cursor: pointer;color: #2F6BCF;">切换</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in personTypeList"
            :key="index"
            :command="item.value"
            :style="queryData.personType == item.value ? {color: '#409EFF', 'font-weight': 700} : ''"
          >{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-col :span="1.5" class="left">
      <i class="jeicon jeicon-time"
        style="margin-right: 10px"
      ></i>
      <span>时间：</span>
    </el-col>
    <el-col :span="6" class="left">
      <el-dropdown
        v-for="(type, tindex) in dateList"
        :key="tindex"
        trigger="click"
        @command="dateTypeSelect"
        class="dropdown left"
      >
        <span
          class="pointer select_label"
          :class="{active:(queryData.date.level === type.level) && !isCustom}"
          @click="handledrop(type)"
        >
          {{ type.active.value }}
          <i
            v-show="queryData.date.level === type.level && !isCustom"
            class="el-icon-caret-bottom"
          ></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, lindex) in type.list"
            :key="lindex"
            :command="item.type"
            :style="queryData.personType == item.value ? {color: '#409EFF', 'font-weight': 700} : ''"
          >
            {{ item.value }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-col :span="6" class="left">
      <el-checkbox v-model="isCustom"></el-checkbox>
      <span>自定义</span>
      <span
        class="dateLabel"
        :style="!isCustom ? { 'color': 'rgba(0, 0, 0, 0.419607843137255)' } : ''"
        @click="datePickerClick"
      >{{ getDateBetween | dateFormat }}</span>
      <el-date-picker
        style="visibility: hidden;height: 0;padding: 0;float: right;"
        v-model="dataRange"
        type="daterange"
        :editable="false"
        :picker-options="dateOptions"
        value-format="yyyy-MM-dd"
        @change="dateChanged"
        ref="datePicker"
      >
      </el-date-picker>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      photoPath: '',
      currentUser: { ...JE.USER },
      user: JE.getCurrentUser(), // 获取当前登录人信息
      queryData: {
        personType: 'QGS',
        personIds: [],
        persons: [],
        date: {
          level: 'week',
          dateType: 'BZ',
          value: '本周',
          startDate: '',
          endDate: '',
        }
      },
      dataRange: [],
      personTypeList: [
        {
          value: 'QGS',
          label: '全公司',
        },
        {
          value: 'WZJ',
          label: '我自己',
        },
        {
          value: 'ZDFW',
          label: '指定范围',
        },
      ],
      dateList: [
        {
          level: 'week',
          active: {},
          list: [
            {
              type: "BZ",
              value: "本周"
            },
            {
              type: "SZ",
              value: "上周"
            }
          ],
        },
        {
          level: 'month',
          active: {},
          list: [
            {
              type: "BY",
              value: "本月"
            },
            {
              type: "SY",
              value: "上月"
            }
          ],
        },
        {
          level: 'quarter',
          active: {},
          list: [
            {
              type: "BJD",
              value: "本季度"
            },
            {
              type: "SYJD",
              value: "上一季度"
            },
          ],
        },
      ],
      dateOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit("pick", [start, end])
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit("pick", [start, end])
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit("pick", [start, end])
            }
          }
        ]
      },
      isCustom: false, // 自定义时间
    }
  },
  watch: {
    queryData: {
      handler(nv, ov) {
        if (nv) {
          this.$emit('params', nv);
        } 
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {
    // this.$set(this.queryData, 'startTime', '');
    // this.$set(this.queryData, 'endTIme', '');
    this.currentUser = {
      id: this.user.userId,
      name: this.user.name || this.user.username,
      photo: this.user.photo
    }
    this.dateList.forEach((item) => {
      item.active = Object.assign({}, item.list[0]);
    })
  },
  computed: {
    getDateBetween() {
      if (this.queryData.date.startDate) {
        if (this.queryData.date.startDate === this.queryData.date.endDate) {
          return this.queryData.date.startDate
        } else {
          return (
            this.queryData.date.startDate + '~' + this.queryData.date.endDate
          )
        }
      } else {
        return moment().format('YYYY-MM-DD')
      }
    },
  },
  methods: {
    // 人员切换
    personTypeSelect(data) {
      var me = this;
      if (data === "QGS") {
        this.queryData.personType = data
        this.queryData.persons = []
        this.queryData.personIds = []
      } else if (data === "WZJ") {
        // this.queryData.personType = data
        this.$set(this.queryData, 'personType', data);
        this.queryData.persons = [this.currentUser];
        this.queryData.personIds = [this.currentUser.id];
        this.photoPath = JE.getUserPhoto(JE.USER.userId, true)
      } else {
        JE.vue.selectUser({
          title: "范围设定",
          multiple:true,
          value:this.queryData.persons,
          valueType:'list',
          callback:function(obj){
            me.personCallback(obj);
          }
        });
      }
    },
    // 人员回调
    personCallback(obj) {
      if (obj && obj.length > 0) {
        let persons = []
        obj.forEach(item => {
          let idStr = item.id.split("_")
          let photo = ""
          if (item.bean.PHOTO) {
            let path = item.bean.PHOTO.split("*")
            photo = path[path.length - 1]
          }
          persons.push({
            id: idStr && idStr.length > 0 ? idStr[idStr.length - 1] : item.id,
            name: item.text,
            photo: photo ? JE.getFileUrl(photo) : ""
          })
        })
        this.queryData.personType = 'ZDFW';
        this.queryData.persons = persons
        this.photoPath = JE.getUserPhoto(persons[0].id,true)
        this.queryData.personIds = this.getPersonIds(persons)
      }
    },
    dateTypeSelect(type) {
      this.dateList.forEach((item) => {
        item.list.forEach((deepitem) => {
          if (deepitem.type === type) {
            item.active = Object.assign({}, deepitem);
            this.queryData.date.level = item.level;
            this.queryData.date.dateType = deepitem.type;
            this.queryData.date.value = deepitem.value;
          }
        })
      })
    },
    handledrop(type){
      if (this.isCustom) {
        this.isCustom = false;
      }
      this.dateList.forEach((item) => {
        if (item.level === type.level) {
          this.queryData.date.level = item.level;
          this.queryData.date.dateType = item.active.type;
          this.queryData.date.value = item.active.value;
        }
      })
    },
    datePickerClick() {
      if (this.isCustom) {
        this.$refs.datePicker.focus()
      }
    },
    dateChanged() {
      if (this.dataRange && this.dataRange.length === 2) {
        this.queryData.date.startDate = this.dataRange[0]
        this.queryData.date.endDate = this.dataRange[1]
      }
    },
    getPersonIds(persons) {
      let personIds = []
      if (persons && persons.length > 0) {
        persons.forEach(item => {
          personIds.push(item.id)
        })
      }
      return personIds
    },
  },
  filters: {
    dateFormat(value) {
      if (value.indexOf("~") > 0) {
        return value
      } else {
        let date = value.split("-")
        if (date && date.length >= 3) {
          return date[0] + "年" + date[1] + "月" + date[2] + "日"
        } else {
          return value
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .title {
    margin-top: 15px;
    padding: 10px 15px;
    background-color: #fff;
    .left {
      height: 40px;
      line-height: 40px;
      margin-left: 10px;
      font-size: 14px;
      position: relative;
      .headImg {
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 100%;
      }
      .select_label {
        border-radius: 15px;
        padding: 4px 10px;
        display: inline-block;
        line-height: 20px;
        &.active {
          color: #fff;
          background: #4080ff;
          border-radius: 15px;
          padding: 4px 10px;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .pointer {
    cursor: pointer;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .clearBoth {
    &:after{
      content: '';
      display: table;
      clear: both;
    }
  }
</style>

<style lang="scss">
  .dateLabel {
    cursor: pointer;
  }
</style>

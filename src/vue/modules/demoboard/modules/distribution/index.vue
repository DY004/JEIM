<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card
          v-loading="salesDataLoading"
          element-loading-text="加载中..."
          :body-style="{ padding: '0px', height:'480px', position: 'relative' }"
          class="box-card distribution"
        >
          <el-tabs style="height: 480px;">
            <el-tab-pane label="借款分布">
              <div
                v-show='salesYear.sales && salesYear.sales.length > 0'
                id="saleBar"
                style="width: 1200px;height: 420px"
              ></div>
              <el-row
                v-show='!salesYear.sales || salesYear.sales.length <= 0'
                type="flex"
                justify="center"
                class="no-content"
              >
                <img
                  class="noCont"
                  src="./../../assets/img/nodata.png"
                />
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="招待费分布">
              <div
                v-show="(salesYear.return && salesYear.return.length > 0) || (salesYear.returnPlan && salesYear.returnPlan.length > 0)"
                id="paymentBar"
                style="width: 1200px;height: 420px"
              ></div>
              <el-row
                v-show='(!salesYear.return || salesYear.return.length <= 0) && (!salesYear.returnPlan && salesYear.returnPlan.length <= 0)'
                type="flex"
                justify="center"
                class="no-content"
              >
                <img
                  class="noCont"
                  src="./../../assets/img/nodata.png"
                />
              </el-row>
            </el-tab-pane>
          </el-tabs>

          <el-row
            class="time"
            type="flex"
            align="middle"
          >
            <el-col
              :span="3"
              class="photo"
            >
              <img
                class="headImg"
                v-if="queryYearData.personType == 'QGS' || (queryYearData.personType == 'ZDFW' && queryYearData.persons && queryYearData.persons.length > 1)"
                src="./../../assets/img/je-headImg.jpg"
              />
              
              <div class="label" v-html="photoPath" v-else></div>
            </el-col>
            <el-col :span="7">
              <span v-if="queryYearData.personType == 'QGS'">全公司</span>
              <span v-if="queryYearData.personType !== 'QGS' && queryYearData.persons.length == 1">{{ queryYearData.persons[0].name }}</span>
              <span v-if="queryYearData.personType !== 'QGS' && queryYearData.persons.length > 1">{{ queryYearData.persons.length}}个员工</span>
              <el-dropdown
                trigger="click"
                @command="personTypeSelectYear"
              >
                <span style="cursor: pointer;color: #2F6BCF;">切换</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="QGS"
                    :style="personTypeYear == 'QGS' ? {color: '#409EFF', 'font-weight': 700}
                      : ''"
                  >全公司</el-dropdown-item>
                  <el-dropdown-item
                    command="WZJ"
                    :style="personTypeYear == 'WZJ' ? {color: '#409EFF', 'font-weight': 700}
                      : ''"
                  >我自己</el-dropdown-item>
                  <el-dropdown-item
                    command="ZDFW"
                    :style="personTypeYear == 'ZDFW' ? {color: '#409EFF', 'font-weight': 700}
                      : ''"
                  >指定范围</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="7">
              <i
                class="jeicon jeicon-time"
                style="margin-right: 10px"
              ></i>时间：
            </el-col>
            <el-col :span="7">
              <el-dropdown
                trigger="click"
                @command="handleYear"
              >
                <span class="activity-time activity-time-select">
                  {{getYearText(queryYearData.date.dateType)}}
                  <i class="el-icon-caret-bottom" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) of yearDatas" :key="index" :command="item">{{ getYearText(item.type) }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    currentUser: {
      type: Object,
      default: () => {},
    },
    queryData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      salesYear: {
        sales: ['120', '132', '101', '134', '90', '230', '210', '220', '182', '191', '234', '290'],
        return: ['220', '182', '191', '234', '290', '330', '310', '150', '232', '201', '154', '190'],
        returnPlan: ['150', '232', '201', '154', '190', '330', '410', '120', '132', '101', '134', '90'],
      },
      queryYearData: {
        personType: "ZDFW",
        personIds: [],
        persons: [],
        date: {
          dateType: ""
        }
      },
      yearDatas: [
        {
          type: "BND",
          value: "本年度"
        },
        {
          type: "QN",
          value: "去年"
        },
        {
          type: "QYN",
          value: "前年"
        }
      ],
      personSelector: {
        type: "all"
      },
      photoPath: '',
    }
  },
  mounted() {
    this.initPaymentBar();
    this.initSaleBar();
  },
  watch: {
    queryData: {
      handler(curVal, oldVal) {
        this.queryYearData.personType = curVal.personType
        this.queryYearData.personIds = JSON.parse(
          JSON.stringify(curVal.personIds)
        )
        if (curVal.personType !== 'QGS') {
          this.photoPath = JE.getUserPhoto(curVal.personIds[0],true);
        }
        this.queryYearData.persons = JSON.parse(JSON.stringify(curVal.persons))
        this.queryYearData.date.dateType =
          curVal.date.level == "year" ? curVal.date.dateType : "BND";
      },
      deep: true,
      // immediate: true,
    },
  },
  methods: {
    personTypeSelectYear(data) {
      var me = this;
      this.personTypeYear = data
      if (data === "QGS") {
        this.queryYearData.personType = data
        this.queryYearData.persons = []
        this.queryYearData.personIds = []
      } else if (data === "WZJ") {
        this.queryYearData.personType = data
        this.queryYearData.persons = [this.currentUser];
        this.queryYearData.personIds = [this.currentUser.id];
        this.photoPath = JE.getUserPhoto(JE.USER.userId,true)
      } else {
        this.personSelector.type = "year"
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
      let queryData =
        this.personSelector.type === "all"
          ? this.queryData
          : this.queryYearData
      queryData.personType = "ZDFW"
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
        queryData.persons = persons
        this.photoPath = JE.getUserPhoto(persons[0].id,true)
        queryData.personIds = this.getPersonIds(persons)
      }
    },
    handleYear(item) {
      this.queryYearData.date.dateType = item.type
    },
    getYearText(val) {
      let str = ""
      for (let item of this.yearDatas) {
        if (item.type === val) {
          str = item.value
        }
      }
      return str
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
    initPaymentBar() {
      // if (
      //   (this.salesYear.returnPlan && this.salesYear.returnPlan.length > 0) ||
      //   (this.salesYear.return && this.salesYear.return.length > 0)
      // ) {
      //   for (let i = 0, len = this.salesYear.returnPlan.length; i < len; i++) {
      //     if (this.salesYear.returnPlan[i] > 0) {
      //       this.salesYear.returnPlan[i] = (this.salesYear.returnPlan[i] + '').split('.')[0] / 10000;
      //     }
      //   }
      //   for (let i = 0, len = this.salesYear.return.length; i < len; i++) {
      //     if (this.salesYear.return[i] > 0) {
      //       this.salesYear.return[i] = (this.salesYear.return[i] + '').split('.')[0] / 10000;
      //     }
      //   }
        let myChart = echarts.init(document.getElementById("paymentBar"), 'macarons')
        // 绘制图表
        myChart.setOption({
          backgroundColor: '#ffffff',
          tooltip: {},
          grid: {
            left: "7%",
            right: "7%",
            top: 70
          },
          xAxis: {
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
            axisLabel: {
              color: "#333333",
              fontSize: 14
            }
          },
          yAxis: {
            name: "金额（万元）",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#333333",
              fontSize: 14
            },
            nameTextStyle: {
              color: "#333333",
              fontSize: 14,
              lineHeight: 40,
              rich: {
                a: {}
              }
            },
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          },
          series: [
            {
              name: "金额（万元）",
              type: "bar",
              barGap: 0,
              barWidth: 40, // 柱图宽度
              barMinHeight: 3,
              data: this.salesYear.returnPlan,
              itemStyle: {
                normal: {
                  // color: "rgba(63, 161, 255, 1)",
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      // color: "rgba(63, 161, 255, 1)",
                      fontSize: 14
                    },
                    offset: [-5, 5]
                  }
                }
              }
            }
          ]
        })
      // }
    },
    initSaleBar() {
      // if (this.salesYear.sales && this.salesYear.sales.length > 0) {
        // for (let i = 0, len = this.salesYear.sales.length; i < len; i++) {
        //   if (this.salesYear.sales[i] > 0) {
        //     this.salesYear.sales[i] = (this.salesYear.sales[i] + '').split('.')[0] / 10000;
        //   }
        // }
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById("saleBar"), 'macarons')
        // 绘制图表
        myChart.setOption({
          backgroundColor: '#ffffff',
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985"
              }
            }
          },
          grid: {
            left: "7%",
            right: "7%",
            top: 70
          },
          xAxis: {
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
            axisLabel: {
              color: "#333333",
              fontSize: 14
            }
          },
          yAxis: {
            name: "金额（万元）",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#333333",
              fontSize: 14
            },
            nameTextStyle: {
              color: "#333333",
              fontSize: 14,
              lineHeight: 40,
              rich: {
                a: {}
              }
            },
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          },
          series: [
            {
              name: "金额（万元）",
              type: "bar",
              barGap: 0,
              barWidth: 40, // 柱图宽度
              barMinHeight: 3,
              data: this.salesYear.sales,
              itemStyle: {
                normal: {
                  // color: "rgba(63, 161, 255, 1)",
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      // color: "rgba(63, 161, 255, 1)",
                      fontSize: 14
                    }
                  }
                }
              }
            }
          ]
        })
      // }
    },
  },
}
</script>

<style lang="scss" scoped>
  .distribution {
    .time {
      width: 350px;
      position: absolute;
      right: 20px;
      top: 15px;
      .el-input {
        input {
          background: #4080ff;
          border: 1px solid #4080ff;
          border-radius: 15px;
          color: #FFFFFF;
          height: 30px;
          line-height: 30px;
          padding-right: 0px;
        }
        i {
          color: #FFFFFF;
          line-height: 30px;
        }
      }
    }
    .headImg {
      height: 38px;
      width: 38px;
      border-radius: 19px;
      border: 1px solid #eeeeee;
    }
    .activity-time {
      padding: 4px 10px;
      cursor: pointer;
    }
    .activity-time-select {
      color: #ffffff;
      background: #4080ff;
      border-radius: 15px;

      i {
        display: inherit;
      }
    }
  }
</style>

<style lang="scss">
  .distribution {
    .el-tabs__nav-scroll {
      padding: 0 30px;
    }
    .el-tabs__item {
      font-weight: 650;
      font-style: normal;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.419607843137255);
      height: 60px;
      line-height: 60px;
    }
    .el-tabs__item.is-active {
      color: #4080FF;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
</style>

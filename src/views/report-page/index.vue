<template>
  <div class="report" width="100%">
    <el-form ref="form" inline :model="form" :rules="rules" size="medium">
      <el-form-item label="起始日">
        <el-date-picker v-model="startDate" type="date" placeholder="选择日期" style="width:140px" />
        <el-time-picker v-model="startTime" arrow-control placeholder="选择时间点" style="width:120px" />
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker v-model="endDate" type="date" placeholder="选择日期" style="width:140px" />
        <el-time-picker v-model="endTime" arrow-control placeholder="选择时间点" style="width:120px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.name" placeholder="请输入用户帐号" clearable style="width:155px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.Id" placeholder="请输入用户ID" clearable style="width:155px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-search" type="primary" @click="doFind()">查找</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-refresh" type="primary" @click="doReFresh()">刷新</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-refresh-right" type="info" @click="doReset()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" size="mini">
      <el-button size="small" type="warning" @click="doSelectDate(1)">今日</el-button>
      <el-button size="small" type="warning" @click="doSelectDate(2)">昨日</el-button>
      <el-button size="small" type="warning" @click="doSelectDate(3)">本周</el-button>
      <el-button size="small" type="warning" @click="doSelectDate(4)">上周</el-button>
      <el-button size="small" type="warning" @click="doSelectDate(5)">本月</el-button>
      <el-button size="small" type="warning" style="margin-bottom: 10px" @click="doSelectDate(6)">上月</el-button>
    </el-form>
    <el-row style="background: #f5f5f5; padding: 0 5px">
      <font size="3" color="#000" style="user-select: none">代理选择 | </font>
      <el-button v-for="item in reportRecord.agents" :key="item" :value="item" type="text" class="id-list" plain size="medium" style="color: #0D47A1; font-size:18px;" @click="doClickAgent(item)">{{ item }} ></el-button>
    </el-row>
    <h5 style="margin: 10px; user-select: none">
      个人收益表：
      <el-button size="small" icon="el-icon-document" @click="excelExport(1)">导出</el-button>
      <el-checkbox v-model="showTable.sscWin1" class="filter-item" style="margin-left:15px; color: #FF5722" @change="tableKey=tableKey+1">
        时时彩
      </el-checkbox>
      <el-checkbox v-model="showTable.jsk3Win1" class="filter-item" style="color: #FF5722" @change="tableKey=tableKey+1">
        江苏快3
      </el-checkbox>
      <el-checkbox v-model="showTable.bjcsWin1" class="filter-item" style="margin-left: -5px; color: #FF5722" @change="tableKey=tableKey+1">
        北京赛车
      </el-checkbox>
    </h5>
    <el-table
      id="report1"
      v-loading="loading"
      :data="reportRecord.tableData1"
      style="width:100%;margin-top:10px;font-size:12px"
      :header-cell-style="this.$Global.tableHeaderColor"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column property="name" fixed label="帐户" align="center" />
      <el-table-column property="level" fixed label="级别" align="center" width="70">
        <template slot-scope="{row}">
          <font color="#00B0FF">{{ row.level }}</font>
        </template>
      </el-table-column>
      <el-table-column property="nikename" fixed label="名称" align="center" />
      <el-table-column property="betNum" label="投注次数" align="center" />
      <el-table-column property="totalWin" label="总输赢金额" align="center" width="90">
        <template slot-scope="scope">
          <span v-show="scope.row.totalWin<0">
            <font color="red">{{ scope.row.totalWin }}</font>
          </span>
          <span v-show="scope.row.totalWin>=0">{{ scope.row.totalWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="bjlWin" label="百家乐输赢" align="center" width="90">
        <template slot-scope="scope">
          <span v-show="scope.row.bjlWin<0">
            <font color="red">{{ scope.row.bjlWin }}</font>
          </span>
          <span v-show="scope.row.bjlWin>=0">{{ scope.row.bjlWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="lhWin" label="龙虎输赢" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.lhWin<0">
            <font color="red">{{ scope.row.lhWin }}</font>
          </span>
          <span v-show="scope.row.lhWin>=0">{{ scope.row.lhWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="nnWin" label="牛牛输赢" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.nnWin < 0">
            <font color="red">{{ scope.row.nnWin }}</font>
          </span>
          <span v-show="scope.row.nnWin>=0">{{ scope.row.nnWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="dxWin" label="大小点" align="center" width="60">
        <template slot-scope="scope">
          <span v-show="scope.row.dxWin<0">
            <font color="red">{{ scope.row.dxWin }}</font>
          </span>
          <span v-show="scope.row.dxWin>=0">{{ scope.row.dxWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="ttsWin" label="推筒子" align="center" width="60">
        <template slot-scope="scope">
          <span v-show="scope.row.ttsWin < 0">
            <font color="red">{{ scope.row.ttsWin }}</font>
          </span>
          <span v-show="scope.row.ttsWin >= 0">{{ scope.row.ttsWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="xjhWin" label="炸金花" align="center" width="60">
        <template slot-scope="scope">
          <span v-show="scope.row.xjhWin < 0">
            <font color="red">{{ scope.row.xjhWin }}</font>
          </span>
          <span v-show="scope.row.xjhWin>=0">{{ scope.row.xjhWin }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTable.sscWin1" property="sscWin" label="时时彩" align="center" width="60">
        <template slot-scope="scope">
          <span v-show="scope.row.sscWin < 0">
            <font color="red">{{ scope.row.sscWin }}</font>
          </span>
          <span v-show="scope.row.sscWin >= 0">{{ scope.row.sscWin }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTable.jsk3Win1" property="jsk3Win" label="江苏快3" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.jsk3Win < 0">
            <font color="red">{{ scope.row.jsk3Win }}</font>
          </span>
          <span v-show="scope.row.jsk3Win>=0">{{ scope.row.jsk3Win }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTable.bjcsWin1" property="bjcsWin" label="北京赛车" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.bjcsWin < 0">
            <font color="red">{{ scope.row.bjcsWin }}</font>
          </span>
          <span v-show="scope.row.bjcsWin>=0">{{ scope.row.bjcsWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="zc" label="占成(%)" align="center" />
      <el-table-column property="xml" label="洗码量(单/双)" align="center" width="120" />
      <el-table-column property="xmb" label="洗码比(单/双)%" align="center" width="120" />
      <el-table-column property="xmyj" label="洗码佣金" align="center" />
      <el-table-column property="totalMoney" label="总金额" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.totalMoney<0">
            <font color="red">{{ scope.row.totalMoney }}</font>
          </span>
          <span v-show="scope.row.totalMoney>=0">{{ scope.row.tottotalMoneyalWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="thisLevelMoney" label="本级金额" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.thisLevelMoney<0">
            <font color="red">{{ scope.row.thisLevelMoney }}</font>
          </span>
          <span v-show="scope.row.thisLevelMoney>=0">{{ scope.row.thisLevelMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column property="companyMoney" label="交公司金额" align="center" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.companyMoney<0" style="color:red">{{ scope.row.companyMoney }}</span>
          <span v-else>{{ scope.row.companyMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column v-show="arrJxb[14]==='1'" label="备注" align="center" width="90">
        <template slot-scope="scope">
          <el-button
            v-show="arrJxb[14]==='1'"
            size="mini"
            type="warning"
            class="el-button-opt"
            @click="handleOneKeyXm(scope.row)"
          >一键结算</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <h5 style="margin: 10px; user-select: none">
      直属代理表：
      <el-button size="small" icon="el-icon-document" @click="excelExport(2)">导出</el-button>
      <el-checkbox v-model="showTable.sscWin2" class="filter-item" style="margin-left:15px; color: #FF5722" @change="tableKey=tableKey+1">
        时时彩
      </el-checkbox>
      <el-checkbox v-model="showTable.jsk3Win2" class="filter-item" style="color: #FF5722" @change="tableKey=tableKey+1">
        江苏快3
      </el-checkbox>
      <el-checkbox v-model="showTable.bjcsWin2" class="filter-item" style="margin-left: -5px; color: #FF5722" @change="tableKey=tableKey+1">
        北京赛车
      </el-checkbox>
      <el-pagination
        :current-page="1"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="reportRecord.totalItemsNum1"
        style="float: right"
        @current-change="handleCurrentChange"
      />
    </h5>
    <el-table
      id="report2"
      v-loading="loading"
      :data="reportRecord.tableData2"
      style="width:100%;margin-top:10px;font-size:12px"
      :header-cell-style="this.$Global.tableHeaderColor"
      border
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange1"
    >
      <el-table-column type="selection" width="35" />
      <el-table-column property="name" fixed label="帐户" align="center">
        <template slot-scope="scope">
          <span
            v-if="scope.row.name!='所有统计'"
            size="mini"
            type="text"
            @click="cellClick(scope.row.Id,scope.row.name,2)"
          >
            <font color="blue" style="cursor: pointer;">{{ scope.row.name }}</font>
          </span>
          <span v-if="scope.row.name==='所有统计'">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column property="level" fixed label="级别" align="center" width="60">
        <template slot-scope="{row}">
          <font color="#00B0FF">{{ row.level }}</font>
        </template>
      </el-table-column>
      <el-table-column property="nikename" fixed label="名称" align="center" />
      <el-table-column property="betNum" label="投注次数" align="center" />
      <el-table-column property="totalWin" label="总输赢金额" align="center" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.totalWin < 0" style="color:red">{{ scope.row.totalWin }}</span>
          <span v-else>{{ scope.row.totalWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="bjlWin" label="百家乐输赢" align="center" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.bjlWin < 0" style="color:red">{{ scope.row.bjlWin }}</span>
          <span v-else>{{ scope.row.bjlWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="lhWin" label="龙虎输赢" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.lhWin < 0" style="color:red">{{ scope.row.lhWin }}</span>
          <span v-else>{{ scope.row.lhWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="nnWin" label="牛牛输赢" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.nnWin < 0" style="color:red">{{ scope.row.nnWin }}</span>
          <span v-else>{{ scope.row.nnWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="dxWin" label="大小点" align="center" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.dxWin < 0" style="color:red">{{ scope.row.dxWin }}</span>
          <span v-else>{{ scope.row.dxWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="ttsWin" label="推筒子" align="center" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.ttsWin < 0" style="color:red">{{ scope.row.ttsWin }}</span>
          <span v-else>{{ scope.row.ttsWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="xjhWin" label="炸金花" align="center" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.xjhWin < 0" style="color:red">{{ scope.row.xjhWin }}</span>
          <span v-else>{{ scope.row.xjhWin }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTable.sscWin2" property="sscWin" label="时时彩" align="center" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.sscWin < 0" style="color:red">{{ scope.row.sscWin }}</span>
          <span v-else>{{ scope.row.sscWin }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTable.jsk3Win2" property="jsk3Win" label="江苏快3" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.jsk3Win < 0" style="color:red">{{ scope.row.jsk3Win }}</span>
          <span v-else>{{ scope.row.jsk3Win }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTable.jbcsWin2" property="bjcsWin" label="北京赛车" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.bjcsWin<0" style="color:red">{{ scope.row.bjcsWin }}</span>
          <span v-else>{{ scope.row.bjcsWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="zc" label="占成(%)" align="center" width="75" />
      <el-table-column property="xml" label="洗码量(单/双)" align="center" width="120" />
      <el-table-column property="xmb" label="洗码比(单/双)%" align="center" width="120" />
      <el-table-column property="xmyj" label="洗码佣金" align="center" />
      <el-table-column property="totalMoney" label="总金额" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.totalMoney < 0" style="color:red">{{ scope.row.totalMoney }}</span>
          <span v-else>{{ scope.row.totalMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column property="thisLevelMoney" label="本级金额" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.thisLevelMoney < 0" style="color:red">{{ scope.row.thisLevelMoney }}</span>
          <span v-else>{{ scope.row.thisLevelMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column property="companyMoney" label="交公司金额" align="center" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.companyMoney < 0" style="color:red">{{ scope.row.companyMoney }}</span>
          <span v-else>{{ scope.row.companyMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column v-show="arrJxb[15] === '1'" label="备注" align="center" width="90">
        <template slot-scope="scope">
          <el-button
            v-show="arrJxb[15]==='1' && scope.row.xm_close === 1"
            size="mini"
            type="primary"
            class="el-button-opt"
          >已结算</el-button>
          <el-button
            v-show="arrJxb[15]==='1' && scope.row.xm_close === 0 && scope.row.xmyj > 0"
            size="mini"
            type="warning"
            class="el-button-opt"
            @click="handleXm(scope.row)"
          >未结算</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-row type="flex" align="middle" justify="end" style="padding: 20px 0;"> -->
    <!-- </el-row> -->
    <h5 style="margin: 10px; user-select: none">
      直属会员表：
      <el-button size="small" icon="el-icon-document" @click="excelExport(3)">导出</el-button>
      <el-checkbox v-model="showTable.sscWin3" class="filter-item" style="margin-left:15px; color: #FF5722" @change="tableKey=tableKey+1">
        时时彩
      </el-checkbox>
      <el-checkbox v-model="showTable.jsk3Win3" class="filter-item" style="color: #FF5722" @change="tableKey=tableKey+1">
        江苏快3
      </el-checkbox>
      <el-checkbox v-model="showTable.bjcsWin3" class="filter-item" style="margin-left: -5px; color: #FF5722" @change="tableKey=tableKey+1">
        北京赛车
      </el-checkbox>
      <el-pagination
        :current-page="1"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="reportRecord.totalItemsNum2"
        style="float: right"
        @current-change="handleCurrentChange2"
      />
    </h5>
    <el-table
      id="report3"
      v-loading="loading"
      :data="reportRecord.tableData3"
      style="width:100%;margin-top:10px;font-size:12px"
      :header-cell-style="this.$Global.tableHeaderColor"
      border
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange2"
    >
      <el-table-column type="selection" width="35" />
      <el-table-column property="name" fixed label="帐户" align="center">
        <template slot-scope="scope">
          <span
            v-if="scope.row.name!='所有统计'"
            size="mini"
            type="text"
            @click="cellClick(scope.row.Id,scope.row.name,3)"
          >
            <font color="blue" style="cursor: pointer;">{{ scope.row.name }}</font>
          </span>
          <span v-if="scope.row.name==='所有统计'">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column property="level" fixed label="级别" align="center" width="60">
        <template slot-scope="{row}">
          <font color="#00BFA5">{{ row.level }}</font>
        </template>
      </el-table-column>
      <el-table-column property="nikename" fixed label="名称" align="center" />
      <el-table-column property="betNum" label="投注次数" align="center" />
      <el-table-column property="totalWin" label="总输赢金额" align="center" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.totalWin < 0" style="color:red">{{ scope.row.totalWin }}</span>
          <span v-else>{{ scope.row.totalWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="bjlWin" label="百家乐输赢" align="center" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.bjlWin < 0" style="color:red">{{ scope.row.bjlWin }}</span>
          <span v-else>{{ scope.row.bjlWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="lhWin" label="龙虎输赢" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.lhWin < 0" style="color:red">{{ scope.row.lhWin }}</span>
          <span v-else>{{ scope.row.lhWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="nnWin" label="牛牛输赢" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.nnWin < 0" style="color:red">{{ scope.row.nnWin }}</span>
          <span v-else>{{ scope.row.nnWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="dxWin" label="大小点" align="center" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.dxWin < 0" style="color:red">{{ scope.row.dxWin }}</span>
          <span v-else>{{ scope.row.dxWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="ttsWin" label="推筒子" align="center" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.ttsWin < 0" style="color:red">{{ scope.row.ttsWin }}</span>
          <span v-else>{{ scope.row.ttsWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="xjhWin" label="炸金花" align="center" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.xjhWin < 0" style="color:red">{{ scope.row.xjhWin }}</span>
          <span v-else>{{ scope.row.xjhWin }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTable.sscWin3" property="sscWin" label="时时彩" align="center" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.sscWin < 0" style="color:red">{{ scope.row.sscWin }}</span>
          <span v-else>{{ scope.row.sscWin }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTable.jsk3Win3" property="jsk3Win" label="江苏快3" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.jsk3Win < 0" style="color:red">{{ scope.row.jsk3Win }}</span>
          <span v-else>{{ scope.row.jsk3Win }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTable.bjcsWin3" property="bjcsWin" label="北京赛车" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.bjcsWin < 0" style="color:red">{{ scope.row.bjcsWin }}</span>
          <span v-else>{{ scope.row.bjcsWin }}</span>
        </template>
      </el-table-column>
      <el-table-column property="zc" label="占成(%)" align="center" width="70" />
      <el-table-column property="xml" label="洗码量(单/双)" align="center" width="120" />
      <el-table-column property="xmb" label="洗码比(单/双)%" align="center" width="120" />
      <el-table-column property="xmyj" label="洗码佣金" align="center" />
      <el-table-column property="totalMoney" label="总金额" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.totalMoney < 0" style="color:red">{{ scope.row.totalMoney }}</span>
          <span v-else>{{ scope.row.totalMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column property="thisLevelMoney" label="本级金额" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.thisLevelMoney < 0" style="color:red">{{ scope.row.thisLevelMoney }}</span>
          <span v-else>{{ scope.row.thisLevelMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column property="companyMoney" label="交公司金额" align="center" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.companyMoney < 0" style="color:red">{{ scope.row.companyMoney }}</span>
          <span v-else>{{ scope.row.companyMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column property="xm_close" label="备注" align="center">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.xm_close === 1 && arrJxb[15] === '1'"
            size="mini"
            type="primary"
            class="el-button-opt"
          >已结算</el-button>
          <el-button
            v-show="arrJxb[15] === '1' && scope.row.xm_close === 0 && scope.row.xmyj > 0"
            size="mini"
            type="warning"
            class="el-button-opt"
            @click="handleXm(scope.row)"
          >未结算</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-row type="flex" align="middle" justify="end" style="padding: 20px 0;">
    </el-row> -->
    <el-dialog title="检测密码" :visible.sync="reportDlgFrm.pwDigFrmVisible" width="300">
      请输入安全码:
      <el-input v-model="reportDlgFrm.pw" placeholder="请输入安全码" class="inputBox" style="width:155px" />
      <br>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reportDlgFrmOk()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- eslint-disable-next-line -->
    <ExportExcel ref="excel" :eData="eData" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import global from '@/api/global'
import share from '@/api/share'
import ExportExcel from '@/components/ExportExcel'
export default {
  components: {
    ExportExcel
  },
  data() {
    return {
      arrJxb: this.$Global.optioner.arrJxb,
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(2019, 9, 10, 12, 0, 0),
      endTime: new Date(2019, 9, 10, 12, 0, 0),
      gameTypeValue: '',
      currentPage1: 1,
      currentPage2: 1,
      pageSize: 8,
      loading: false,
      select_xm_dl: [],
      select_xm_hy: [],
      xm_ok: false,
      xm_pw_ok: false,
      sendXmStr: '',
      tableKey: 0,
      showTable: {
        sscWin1: false,
        jsk3Win1: false,
        bjcsWin1: false,
        sscWin2: false,
        jsk3Win2: false,
        bjcsWin2: false,
        sscWin3: false,
        jsk3Win3: false,
        bjcsWin3: false
      },
      form: {
        name: '',
        Id: ''
      },
      reportDlgFrm: {
        pw: '',
        pwDigFrmVisible: false
      },
      rules: {
        account: {
          type: 'string',
          required: true,
          message: '必填字段',
          trigger: 'change'
        },
        nickname: {
          type: 'string',
          required: true,
          message: '必填字段',
          trigger: 'change'
        }
      },
      // eslint-disable-next-line
      eData: {}
    }
  },
  computed: {
    ...mapState({ reportRecord: state => state.ht.reportForm }),
    // eslint-disable-next-line
    stateDemo() {
      // this.reportRecord = this.$store.state.ht.reportForm
      // if (this.reportRecord.state === 1) this.loading = false
      if (this.$store.state.ht.xm_ok === true) {
        // this.$router.push({ path: '/log' })
        this.$store.commit('ht/setXmState', false)
      }
      if (this.$store.state.ht.xm_pw_ok === true) {
        this.$store.commit('ht/setXmPwOk', false)
        // eslint-disable-next-line
        this.reportDlgFrm.pwDigFrmVisible = false
        if (this.sendXmStr !== '') this.$pomelo.send(this.sendXmStr)
      }
    }
  },
  watch: {
    stateDemo() {
      // 暂时用监听方式,切忌滥用
      // console.log('vuex变化啦')
    }
  },
  created() {
    this.$store.commit('ht/setXmState', false)
    this.doSelectDate(1)
    this.doClickAgent(global.optioner.UserName)
  },
  methods: {
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    doClickAgent(name) {
      this.form.name = name
      // this.form.Id = ''
      this.sendStr('', name, 1, 1)
    },
    doFind() {
      var Id = this.form.Id
      var name = this.form.name
      if (Id === '' && name === '') {
        name = this.$Global.optioner.UserName
        Id = this.$Global.optioner.Id
      }
      this.sendStr(Id, name, 1, 1)
      console.log('report .... ', this.reportRecord)
    },
    doReFresh() {
      this.doFind()
      // this.form.name = ''
      // this.form.Id = ''
      // // this.doSelectDate(1)
      // this.sendStr(
      //   this.$Global.optioner.Id,
      //   this.$Global.optioner.UserName,
      //   1,
      //   1
      // )
    },
    doReset() {
      this.form.name = ''
      this.form.Id = ''
      this.doSelectDate(1)
      this.sendStr(this.$Global.optioner.Id, this.$Global.optioner.UserName, 1, 1)
    },
    cellClick(Id, name, level) {
      if (level === 2) {
        Id = ''
        this.form.name = name
        this.sendStr(Id, name, this.currentPage1, this.currentPage2)
      }
      if (level === 3) {
        // var date1 = this.getSelectDate()
        this.$router.push({
          path: '/bet-records/bet-records',
          query: {
            name: name
            // startTime: date1[0],
            // endTime: date1[1]
          }
        })
        // this.$store.commit('set_active_index', '/memberTrade')
      }
    },
    getSelectDate() {
      var d = this.startDate
      var d1 = this.endDate
      var date1 = this.$moment(d).format('YYYY-MM-DD') + ' ' + this.$moment(this.startTime).format('HH:mm:ss')
      var date2 = this.$moment(d1).format('YYYY-MM-DD') + ' ' + this.$moment(this.endTime).format('HH:mm:ss')
      return [date1, date2]
    },
    handleCurrentChange(val) {
      this.currentPage1 = val
      var Id = this.form.Id
      var name = this.form.name
      if (Id === '' && name === '') {
        name = this.$Global.optioner.UserName
        Id = this.$Global.optioner.Id
      }
      this.sendStr(Id, name, this.currentPage1, this.currentPage2)
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
      var Id = this.form.Id
      var name = this.form.name
      if (Id === '' && name === '') {
        name = this.$Global.optioner.UserName
        Id = this.$Global.optioner.Id
      }
      this.sendStr(Id, name, this.currentPage1, this.currentPage2)
    },
    sendStr(Id, name, page1, page2) {
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetReport',
        JsonData: {
          Id: Id,
          name: name,
          opt_id: this.$Global.optioner.Id,
          startTime: r[0],
          endTime: r[1],
          pageSize: this.pageSize,
          currentPage1: page1,
          currentPage2: page2
        }
      }
      // this.loading = true
      this.$store.commit('ht/setReportForm', { state: 0 })
      this.$pomelo.send(sendStr)
    },
    getSummaries1(param) {
      // 直属代理统计
      var t_data = this.reportRecord.tableData4
      this.reportRecord.totalItemsNum1 = t_data.length > 0 ? t_data[0].count : 0
      return this.getData(t_data, param)
    },
    getSummaries2(param) {
      // 直属代理统计
      var t_data = this.reportRecord.tableData5
      this.reportRecord.totalItemsNum2 = t_data.length > 0 ? t_data[0].count : 0
      return this.getData(t_data, param)
    },
    getData(t_data, param) {
      const sums = []
      const { columns, data } = param
      console.log('data', data)
      if (t_data.length === 0) {
        t_data.push({ count: 0 })
      }
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '所有统计:'
          return
        }
        // this.loading = false
        var data = t_data[0]
        if (t_data[0].count > 0) {
          if (t_data[0].xml_s === null) t_data[0].xml_s = 0
          if (t_data[0].xml_d === null) t_data[0].xml_d = 0
        }
        switch (column.property) {
          case 'betNum':
            sums[index] = data.count > 0 ? data.tzcs : 0
            break
          case 'totalWin':
            sums[index] = data.count > 0 ? data.yl.toFixed(2) : 0
            break
          case 'bjlWin':
            sums[index] = data.count > 0 ? data.bjl_yl.toFixed(2) : 0
            break
          case 'lhWin':
            sums[index] = data.count > 0 ? data.lh_yl.toFixed(2) : 0
            break
          case 'nnWin':
            sums[index] = data.count > 0 ? data.nn_yl.toFixed(2) : 0
            break
          case 'dxWin':
            sums[index] = data.count > 0 ? data.dx_yl.toFixed(2) : 0
            break
          case 'ttsWin':
            sums[index] = data.count > 0 ? data.tts_yl.toFixed(2) : 0
            break
          case 'xjhWin':
            sums[index] = data.count > 0 ? data.xjh_yl.toFixed(2) : 0
            break
          case 'sscWin':
            sums[index] = data.count > 0 ? data.ssc_yl.toFixed(2) : 0
            break
          case 'jsk3Win':
            sums[index] = data.count > 0 ? data.jsk3_yl.toFixed(2) : 0
            break
          case 'bjcsWin':
            sums[index] = data.count > 0 ? data.bjcs_yl.toFixed(2) : 0
            break
          case 'xml':
            sums[index] =
              data.count > 0 ? data.xml_s + '/' + data.xml_d : '0/0'
            break
          case 'xmyj':
            sums[index] = data.count > 0 ? data.xmyj : 0
            break
          case 'totalMoney':
            sums[index] = data.count > 0 ? data.totalMoney : 0
            break
          case 'thisLevelMoney':
            sums[index] = data.count > 0 ? data.thisMoney : 0
            break
          case 'companyMoney':
            sums[index] = data.count > 0 ? data.companyMoney : 0
            break
          default:
            break
        }
      })
      return sums
    },
    excelExport(val) {
      switch (val) {
        case 1:
          this.eData = {
            tHeader: ['账号', '级别', '名称', '投注次数', '总输赢金额', '百家乐输赢', '龙虎输赢', '牛牛输赢', '大小点', '推筒子', '炸金花', '时时彩', '江苏快3', '北京赛车', '占成(%)', '洗码量(单/双)', '洗码比(单/双)%', '洗码佣金', '总金额', '本级金额', '交公司金额'],
            filterVal: ['name', 'level', 'nikename', 'betNum', 'totalWin', 'bjlWin', 'lhWin', 'nnWin', 'dxWin', 'ttsWin', 'xjhWin', 'sscWin', 'jsk3Win', 'bjcsWin', 'zc', 'xml', 'xmb', 'xmyj', 'totalMoney', 'thisLevelMoney', 'companyMoney'],
            list: this.reportRecord.tableData1
          }
          if (this.reportRecord.tableData1 === undefined) {
            return
          }
          this.$refs.excel.excleForm = true
          break
        case 2:
          this.eData = {
            tHeader: ['账号', '级别', '名称', '投注次数', '总输赢金额', '百家乐输赢', '龙虎输赢', '牛牛输赢', '大小点', '推筒子', '炸金花', '时时彩', '江苏快3', '北京赛车', '占成(%)', '洗码量(单/双)', '洗码比(单/双)%', '洗码佣金', '总金额', '本级金额', '交公司金额'],
            filterVal: ['name', 'level', 'nikename', 'betNum', 'totalWin', 'bjlWin', 'lhWin', 'nnWin', 'dxWin', 'ttsWin', 'xjhWin', 'sscWin', 'jsk3Win', 'bjcsWin', 'zc', 'xml', 'xmb', 'xmyj', 'totalMoney', 'thisLevelMoney', 'companyMoney'],
            list: this.reportRecord.tableData2
          }
          if (this.reportRecord.tableData2 === undefined) {
            return
          }
          this.$refs.excel.excleForm = true
          break
        case 3:
          this.eData = {
            tHeader: ['账号', '级别', '名称', '投注次数', '总输赢金额', '百家乐输赢', '龙虎输赢', '牛牛输赢', '大小点', '推筒子', '炸金花', '时时彩', '江苏快3', '北京赛车', '占成(%)', '洗码量(单/双)', '洗码比(单/双)%', '洗码佣金', '总金额', '本级金额', '交公司金额'],
            filterVal: ['name', 'level', 'nikename', 'betNum', 'totalWin', 'bjlWin', 'lhWin', 'nnWin', 'dxWin', 'ttsWin', 'xjhWin', 'sscWin', 'jsk3Win', 'bjcsWin', 'zc', 'xml', 'xmb', 'xmyj', 'totalMoney', 'thisLevelMoney', 'companyMoney'],
            list: this.reportRecord.tableData3
          }
          if (this.reportRecord.tableData3 === undefined) {
            return
          }
          this.$refs.excel.excleForm = true
          break
      }
    },
    // 选择日期按钮点击事件
    doSelectDate(n) {
      switch (n) {
        case 1:
          this.today()
          this.doFind()
          break
        case 2:
          this.yesterday()
          this.doFind()
          break
        case 3:
          this.theWeek()
          this.doFind()
          break
        case 4:
          this.lastWeek()
          this.doFind()
          break
        case 5:
          this.thisMonth()
          this.doFind()
          break
        case 6:
          this.lastMonth()
          this.doFind()
          break
        default:
          this.today()
          this.doFind()
      }
    },
    // 昨日按钮
    yesterday() {
      var dateArr = new Date()
      dateArr.setTime(dateArr.getTime() - 24 * 60 * 60 * 1000)
      var dateArr1 = share.getDateBetween(0, '12:00:00', '今天')
      var startTime = this.$moment(dateArr).format('YYYY-MM-DD HH:mm:ss')
      // var endTime = dateArr1[0].split(' ')
      this.startDate = startTime.split(' ')[0]
      this.endDate = dateArr1[0]
    },
    // 今日
    today() {
      var dateArr = share.getDateBetween(0, '12:00:00', '今天')
      // var startTime = dateArr[0]
      var dateArr1 = new Date()
      dateArr1.setTime(dateArr1.getTime() + 24 * 60 * 60 * 1000)
      var Months = dateArr1.getMonth() + 1
      var Days = dateArr1.getDate()
      if (Months < 10) {
        Months = '0' + Months
      }
      if (Days < 10) {
        Days = '0' + Days
      }
      var endTime =
        dateArr1.getFullYear() + '-' + Months + '-' + Days
      this.startDate = dateArr[0]
      this.endDate = endTime.split(' ')[0]
    },
    // 本周
    theWeek() {
      var dateArr = share.getWeekStartAndEnd(0, new Date())
      var dateArr1 = share.getWeekStartAndEnd(1, new Date())
      // var startTime = dateArr[0]
      // var endTime = dateArr[1]
      this.startDate = dateArr[0]
      this.endDate = dateArr1[0]
    },
    // 上周
    lastWeek() {
      var dateArr = share.getDateBetween(3, '12:00:00', '上周')
      var dateArr1 = share.getWeekStartAndEnd(0, new Date())
      // var startTime = dateArr[0]
      // var endTime = dateArr[1]
      this.startDate = dateArr[0]
      this.endDate = dateArr1[0]
    },
    // 本月
    thisMonth() {
      var dateArr = share.getDateBetween(4, '12:00:00', '本月')
      // var startTime = dateArr[0]
      var date = new Date()
      var currentMonth = date.getMonth()
      var nextMonth = ++currentMonth
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
      // var oneDay = 1000 * 60 * 60 * 24
      var endTime =
        this.$moment(new Date(nextMonthFirstDay)).format(
          'YYYY-MM-DD'
        )
      this.startDate = dateArr[0]
      this.endDate = endTime.split(' ')[0]
    },
    // 上月
    lastMonth() {
      var dateArr = share.getDateBetween(5, '12:00:00', '上月')
      var dateArr1 = share.getDateBetween(4, '12:00:00', '本月')
      // var startTime = dateArr[0]
      // var endTime = dateArr[1]
      this.startDate = dateArr[0]
      this.endDate = dateArr1[0]
    },
    // // 获得某月的天数
    // getMonthDays(nowYear, myMonth) {
    //   var monthStartDate = new Date(nowYear, myMonth, 1)
    //   var monthEndDate = new Date(nowYear, myMonth + 1, 1)
    //   var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
    //   return days
    // },
    // getDateStr() {
    //   var date = new Date()
    //   date.setTime(date.getTime() + 24 * 60 * 60 * 1000)
    //   return date
    // },
    // formateDate(now) {
    //   var day = ('0' + now.getDate()).slice(-2)
    //   // 格式化月，如果小于9，前面补0
    //   var month = ('0' + (now.getMonth() + 1)).slice(-2)
    //   // 拼装完整日期格式
    //   var today = now.getFullYear() + '-' + month + '-' + day
    //   return day(today)
    // },
    handleSelectionChange1(row) {
      this.select_xm_dl = []
      for (let i = 0; i < row.length; i++) {
        var obj = {}
        obj.Id = row[i].Id
        obj.userId = row[i].userId
        obj.xmyj = row[i].xmyj
        this.select_xm_dl.push(obj)
      }
    },
    handleSelectionChange2(row) {
      this.select_xm_hy = []
      for (let i = 0; i < row.length; i++) {
        var obj = {}
        obj.Id = row[i].Id
        obj.userId = row[i].userId
        obj.xmyj = row[i].xmyj
        this.select_xm_hy.push(obj)
      }
    },
    handleOneKeyXm(row) {
      if (row.userId !== this.$Global.optioner.Id) {
        this.$message.warning('不能跨级结算!!!')
        return
      }
      let xm_score = 0
      const optRecord = this.select_xm_dl.concat(this.select_xm_hy)
      if (optRecord.length === 0) {
        this.$message.warning('未选择任何结算帐户')
        return
      }
      for (let i = 0; i < optRecord[i].length; i++) {
        xm_score += optRecord[i].xmyj
      }
      const sendStr = {
        router: 'DoXm',
        JsonData: {
          optId: this.$Global.optioner.Id,
          optRecord: optRecord,
          xm_score: xm_score
        }
      }
      this.sendXmStr = sendStr
      this.reportDlgFrm.pwDigFrmVisible = true
      this.$store.commit('ht/setXmState', false)
    },
    handleXm(row) {
      // n=1代理,n=2会员
      // console.log('row:',row)
      const optRecord = []
      var obj = {}
      obj.Id = row.Id
      obj.userId = row.userId
      obj.xmyj = row.xmyj
      optRecord.push(obj)
      // let xm_score = 0
      const sendStr = {
        router: 'DoXm',
        JsonData: {
          optId: this.$Global.optioner.Id,
          optRecord: optRecord,
          xm_score: row.xmyj
        }
      }
      this.sendXmStr = sendStr
      this.$store.commit('ht/setXmState', false)
      this.reportDlgFrm.pwDigFrmVisible = true
    },
    reportDlgFrmOk() {
      const pw = this.reportDlgFrm.pw
      if (pw === '') {
        this.$message.warning('安全码不能为空')
        return
      }
      const sendStr = {
        router: 'chkXmPw',
        JsonData: {
          optId: this.$Global.optioner.Id,
          pw: this.$md5(pw + this.$Global.addPwStr)
        }
      }
      this.$pomelo.send(sendStr)
    },
    changeSwitch(data) {
      if (data.sEnable === '禁用') this.$message.success('设为禁用成功')
      if (data.sEnable === '启用') this.$message.success('设为启用成功')
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'color-row'
      }
      return ''
    }
  }
}
</script>
<style scoped>
.report {
  margin: 10px;
}
.id-list{
  padding: 5px;
}
.id-list:hover{
  background: none;
  /* border-top: none !important;
  border-right: none !important;
  border-bottom: 1px solid grey !important;
  border-left: none !important; */
}
</style>

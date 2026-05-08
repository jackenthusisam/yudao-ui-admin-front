<script setup lang="ts">
import { Bell, BriefcaseBusiness, Check, Crown, Download, MessageCircle, Rocket, UsersRound, X } from 'lucide-vue-next'
import AppLayout from '../components/AppLayout.vue'

const rights = [
  { title: '会员专享价格', icon: Crown, text: '会员享受更低价格，节省采购成本' },
  { title: '项目上新提醒', icon: Bell, text: '第一时间推送最新优质项目' },
  { title: '专属社群', icon: UsersRound, text: '加入优质社群，资源对接交流' },
  { title: '推广返佣', icon: Rocket, text: '推广项目获取佣金，收益可观' },
  { title: '优先咨询服务', icon: MessageCircle, text: '优先响应，专业顾问解答' },
  { title: '精选项目库', icon: BriefcaseBusiness, text: '筛选优质项目，降低试错成本' },
]

const rows = ['项目浏览权限', '会员专享价格', '项目上新提醒', '专属社群', '推广返佣', '优先咨询服务', '精选项目库', '项目联系方式', '团队权限管理', '客户经理服务']
</script>

<template>
  <AppLayout>
    <section class="membership-page">
      <div class="container membership-head">
        <h1>开通会员，<span>解锁更多优质项目</span></h1>
        <p>会员专享更多优质项目资源、更低价格、更快信息获取速度，助力您的项目落地与业务增长。</p>
      </div>

      <div class="container pricing-grid">
        <article class="plan-card muted">
          <span class="avatar"></span>
          <h2>普通用户</h2>
          <p>基础项目浏览权限</p>
          <div class="plan-price">￥0<small>/永久</small></div>
          <ul>
            <li>浏览部分公开项目</li>
            <li>查看项目基础信息</li>
            <li>无法查看联系方式</li>
            <li>无专属服务与支持</li>
          </ul>
          <button class="outline-btn wide">免费注册</button>
        </article>

        <article class="plan-card featured">
          <span class="recommend">推荐</span>
          <div class="crown-bubble"><Crown :size="42" /></div>
          <h2>699会员</h2>
          <p>解锁更多优质项目与权益</p>
          <div class="plan-price red">￥699<small>/年</small></div>
          <div class="two-col-list">
            <span><Check :size="18" />会员专享价格</span>
            <span><Check :size="18" />优先咨询服务</span>
            <span><Check :size="18" />项目上新提醒</span>
            <span><Check :size="18" />精选项目库</span>
            <span><Check :size="18" />专属社群</span>
            <span><Check :size="18" />项目联系方式</span>
          </div>
          <button class="primary-btn full">立即开通</button>
          <a class="chat-link"><MessageCircle :size="18" />咨询会员权益</a>
        </article>

        <article class="plan-card muted">
          <span class="avatar blue"><BriefcaseBusiness :size="32" /></span>
          <h2>合伙人版</h2>
          <p>适合团队与机构用户</p>
          <div class="plan-price">￥1999<small>/年起</small></div>
          <ul>
            <li>包含699会员全部权益</li>
            <li>团队成员权限管理</li>
            <li>专属客户经理服务</li>
            <li>更高推广返佣比例</li>
          </ul>
          <button class="outline-btn wide">立即咨询</button>
        </article>
      </div>

      <section class="container compare-card">
        <h2>会员权益对比</h2>
        <div class="compare-table">
          <div class="table-row head"><b>权益对比</b><b>普通用户</b><b>699会员</b><b>合伙人版</b></div>
          <div v-for="(row, index) in rows" :key="row" class="table-row">
            <span>{{ row }}</span>
            <span v-if="index === 0">部分公开项目</span><span v-else><X :size="16" /></span>
            <span><Check :size="17" /></span>
            <span><Check :size="17" /></span>
          </div>
        </div>
      </section>

      <section class="container member-info-grid">
        <div class="info-panel">
          <h2>会员权益</h2>
          <div class="rights-grid">
            <div v-for="item in rights" :key="item.title">
              <component :is="item.icon" :size="32" />
              <strong>{{ item.title }}</strong>
              <span>{{ item.text }}</span>
            </div>
          </div>
        </div>
        <div class="info-panel">
          <h2>适合哪些人</h2>
          <div class="people-list">
            <div><Rocket :size="36" /><strong>创业者</strong><span>寻找优质项目，快速启动创业</span></div>
            <div><UsersRound :size="36" /><strong>运营人员</strong><span>获取最新项目，提升运营效率</span></div>
            <div><BriefcaseBusiness :size="36" /><strong>团队/公司</strong><span>批量对接项目，推动业务增长</span></div>
            <div><Download :size="36" /><strong>推广人员</strong><span>推广优质项目，获取高额佣金</span></div>
          </div>
        </div>
        <div class="info-panel">
          <h2>常见问题</h2>
          <details open><summary>699会员的有效期是多久？</summary><p>699会员的有效期为1年，自开通之日起计算。</p></details>
          <details open><summary>开通后可以退款吗？</summary><p>会员服务为虚拟服务，开通后不支持退款，请理性选择。</p></details>
          <details><summary>如何获取项目联系方式？</summary><p>开通会员后，在项目详情页即可查看联系方式。</p></details>
          <details><summary>合伙人版如何开通？</summary><p>提交咨询后由顾问联系并配置团队权益。</p></details>
        </div>
      </section>

      <section class="container bottom-cta">
        <Crown :size="72" />
        <div>
          <h2>成为会员，开启项目增长新机遇</h2>
          <p>699元/年，解锁更多优质项目与专属权益</p>
        </div>
        <strong>￥699<small>/年</small></strong>
        <button class="primary-btn">立即开通会员</button>
        <button class="outline-btn wide"><MessageCircle :size="18" />咨询会员权益</button>
      </section>
    </section>
  </AppLayout>
</template>

<template>
  <div>
    <PageHero title="Calculo de Importación desde Amazon" />

    <b-field>
      <b-checkbox v-model="useParams">
        {{ useParams }}
      </b-checkbox>
    </b-field>

    <b-button
      label="Agregar Orden"
      type="is-link"
      icon-left="account-search"
      @click.prevent="addOrder"
    />

    <div
      class="box"
      v-for="(order, orderKey) in orders"
    >
      <div class="b-table">
        <b-field
          label="Name"
          label-position="inside"
        >
          <b-input
            v-model="order.name"
            type="text"
          ></b-input>
        </b-field>
        <b-field
          label="Shipping Total"
          label-position="inside"
        >
          <b-input
            v-model="order.totalShipping"
            type="number"
          ></b-input>
        </b-field>
        <span>Order Total: {{ orderTotal(order) }}</span>

        <div class="table-wrapper has-mobile-cards">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 30%;">
                  <div class="th-wrap is-relative">Name</div>
                </th>
                <th style="width: 30%;">
                  <div class="th-wrap is-relative">Price</div>
                </th>
                <th style="width: 35%;"></th>
                <th style="width: 5%;"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in order.items">
                <td>
                  <b-input
                    v-model="item.name"
                    type="text"
                    expanded
                  ></b-input>
                </td>
                <td>
                  <b-input
                    v-model="item.price"
                    type="number"
                    expanded
                  ></b-input>
                </td>
                <td>
                  <ul>
                    <li>
                      %: {{ itemPercentage(order, item) }}
                    </li>
                    <li>
                      Total: {{ itemTotal(order, item) }}
                    </li>
                  </ul>
                </td>
                <td>
                  <b-button
                    type="is-danger"
                    icon-left="minus"
                    @click="removeItem(order, key)"
                  />
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <div class="buttons">
                    <b-button
                      type="is-success"
                      icon-left="file-plus"
                      @click="addItem(order)"
                    >
                    </b-button>
                    <b-button
                      type="is-danger"
                      icon-left="trash-can-outline"
                      @click="removeOrder(orderKey)"
                    />
                  </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script
  lang="ts"
  setup
>
import type { Item, Order } from '~/types/amazon'

const useParams = ref(true)
const params = computed(() => ({
  fee: useParams.value ? 0.03 : 0,
  minimumFee: useParams.value ? 20 : 0,
  exchangeRate: useParams.value ? 7.78 : 7.6
}))

const orders = ref<Array<Order>>([])

const addOrder = () => {
  let newOrder: Order = {
    name: "",
    items: [],
    totalShipping: 0,
  };

  orders.value.push(newOrder)
}

const addItem = (order: Order) => {
  let newItem: Item = {
    name: "",
    price: 0,
  };

  order.items.push(newItem)
}

const removeItem = (order: Order, index: number) => {
  order.items.splice(index, 1)
}

const removeOrder = (index: number) => {
  orders.value.splice(index, 1)
}

const orderTotal = (order: Order) => {
  let total = 0
  order.items.forEach((item) => {
    total += +item.price
  });

  return +total;
}

const itemPercentage = (order: Order, item: Item) => {
  return roundUp((item.price / orderTotal(order)) * 100)
}

const itemShipping = (order: Order, item: Item) => {
  return roundUp(order.totalShipping * (itemPercentage(order, item) / 100))
}

const itemTotal = (order: Order, item: Item) => {
  let total = (item.price * params.value.exchangeRate) + itemShipping(order, item)
  let totalFee = total * params.value.fee
  if (totalFee < params.value.minimumFee) {
    totalFee = params.value.minimumFee
  }
  return roundUp(total + totalFee).toFixed(2)
}

const roundUp = (num: number, precision: number = 2) => {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}

</script>

<style></style>
<template>
  <tbody>
    <template v-for="(row, rowIndex) in tbodyData">
      <tr
        class="table_row"
        :key="`row${rowIndex}`"
        :class="{
          checked_row: selectedRows[rowIndex]
        }"
      >
        <td
          v-if="tbodyIndex"
          class="index"
          :class="{ highlight_spreadsheet: tbodyHighlight.includes(rowIndex) }"
          :key="`td-${currentTable}-index-${rowIndex}`"
          @mouseover="addToVisibleCheckboxes(rowIndex)"
          @mouseleave="removeFromVisibleCheckboxes(rowIndex)"
          @contextmenu.prevent="handleContextMenuTd($event, null, rowIndex, -1, null)"
        >
          <span v-if="!selectedRows[rowIndex] && !visibleRowCheckboxes.includes(rowIndex)">
            {{ rowIndex + 1 }}
          </span>
          <el-checkbox
            v-if="selectedRows[rowIndex] || visibleRowCheckboxes.includes(rowIndex)"
            v-model="selectedRows[rowIndex]"
            @change="checkedRow(tbodyData[rowIndex])"
          />
        </td>

        <template v-for="(header, colIndex) in headerKeys">
          <td
            v-if="row[header]"
            class="td"
            :data-header="header"
            :data-col-index="colIndex"
            :data-row-index="rowIndex"
            :data-type="headersAsObj[header].type"
            @mouseover.stop="handleHoverTooltip(header, rowIndex, colIndex, headersAsObj[header].type)"
            @mouseout.stop="handleOutTooltip"
            @click.shift.exact="
              handleSelectMultipleCell($event, header, rowIndex, colIndex, headersAsObj[header].type)
            "

            @click.exact="
              handleClickTd($event, row[header], header, rowIndex, colIndex, headersAsObj[header].type)
            "
            @dblclick="
              handleDoubleClickTd($event, header, row[header], rowIndex, colIndex, headersAsObj[header].type)
            "
            @mousemove="handleMoveDragToFill($event, header, row[header], rowIndex, colIndex)"
            @mouseup="
              handleUpDragToFill($event, header, row[header], rowIndex, colIndex, headersAsObj[header].type)
            "
            @contextmenu.prevent="handleContextMenuTd($event, row[header], header, rowIndex, colIndex, row[header].type)"
            :class="{
              active_td: row[header].active || row[header].highlight,
              highlight_td: row[header].highlight,
              show: row[header].show,
              selected: row[header].selected,
              copy: row[header].stateCopy,
              disabled: row[header].disabled || disableCells.find((x) => x === header),
              rectangleSelection: row[header].rectangleSelection,
            }"
            :current-table="currentTable"
            :ref="`td-${currentTable}-${colIndex}-${rowIndex}`"
            :key="header"
            :style="row[header].style"
          >
            <transition name="transitionTooltip">
              <div
                class="vuetable_tooltip"
                v-if="
                  row[header].value !== '' &&
                  !row[header].search &&
                  !row[header].active &&
                  headersAsObj[header].type !== 'img' &&
                  !row[header].selected &&
                  vuetableTooltip[rowIndex] === header
                "
              >
                {{ row[header].value }}
              </div>
            </transition>

            <span
              class="vuetable_triange"
              :style="[
                row[header].comment.borderColor
                  ? { borderTopColor: row[header].comment.borderColor }
                  : {},
              ]"
              v-if="row[header].value !== '' && !row[header].search && row[header].comment"
              @mouseover.stop="handleHoverTriangleComment(header, rowIndex)"
              @mouseout.stop="handleOutTriangleComment"
            >
              <transition name="transitionComment">
                <div
                  class="vuetable_triange_comment"
                  v-if="vueTableComment[rowIndex] === header && row[header].comment.value"
                  @mouseout.stop="handleOutTriangleComment"
                >
                  {{ row[header].comment.value }}
                </div>
              </transition>
            </span>

            <button
              class="drag_to_fill"
              @mousedown="handleDownDragToFill($event, header, row[header], rowIndex, colIndex)"
              @mouseup="
                handleUpDragToFill(
                  $event,
                  header,
                  row[header],
                  rowIndex,
                  colIndex,
                  headersAsObj[header].type
                )
              "
            ></button>

            <div class="submenu" :ref="`contextMenu-${currentTable}-${colIndex}-${rowIndex}`">
              <div
                class="submenu_wrap"
                v-if="
                  submenuTbody &&
                  submenuStatusTbody &&
                  rowIndex === submenuEnableRow &&
                  colIndex === submenuEnableCol &&
                  submenuTbody.find((sub) => sub.disabled.includes(header) === 0)
                "
              >
                <template v-for="(submenu, index) in submenuTbody">
                  <template v-if="submenu.type === 'button'">
                    <button
                      v-if="submenu.disabled.includes(header) === 0"
                      :key="index"
                      @click.stop="
                        handleClickSubmenu(
                          $event,
                          header,
                          rowIndex,
                          colIndex,
                          headersAsObj[header].type,
                          submenu.function
                        )
                      "
                    >
                      {{ submenu.value }}
                    </button>
                  </template>
                </template>
              </div>
            </div>

            <!-- If Img -->
            <template v-if="headersAsObj[header].type === 'img'">
              <span>
                <img :src="row[header].value" :title="row[header].value" />
              </span>
            </template>

            <!-- If Input -->
            <template v-if="['text', 'integer', 'decimal', 'percentage'].includes(headersAsObj[header].type)">
              <span class="display-text" :ref="`span-${currentTable}-${colIndex}-${rowIndex}`">
                {{ formatValue(headersAsObj[header].type, row[header].value) }}
              </span>
              <textarea
                v-model="row[header].value"
                @keydown="inputHandleKeydown($event, header, rowIndex, colIndex, this)"
                @change="inputHandleChange($event, header, rowIndex, colIndex)"
                @keyup.esc="escKeyup(row[header], rowIndex, header, colIndex, headersAsObj[header].type)"
                :ref="`textarea-${currentTable}-${colIndex}-${rowIndex}`"
              >
              </textarea>
            </template>

            <template v-if="headersAsObj[header].type === 'date'">
              <span class="display-text" :ref="`span-${currentTable}-${colIndex}-${rowIndex}`">
                {{ formatValue(headersAsObj[header].type, row[header].value) }}
              </span>
              <h-date-picker
                v-model="row[header].value"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="inputHandleChange($event, header, rowIndex, colIndex)"
                :ref="`datepicker-${currentTable}-${colIndex}-${rowIndex}`"
              />
            </template>

            <!-- If Select -->
            <template v-if="headersAsObj[header].type === 'category'">
              <span class="display-text" :ref="`span-${currentTable}-${colIndex}-${rowIndex}`">
                {{ getLabelFromValue(row[header].value, headersAsObj[header].selectOptions) }}
              </span>
              <h-select
                :ref="`vsSelect-${currentTable}-${colIndex}-${rowIndex}`"
                v-model="row[header].value"
                :options="headersAsObj[header].selectOptions"
                @change="inputHandleChange($event, header, rowIndex, colIndex)"
                @keyup.esc="escKeyup(row[header], rowIndex, header, colIndex, headersAsObj[header].type)"
              />
            </template>
            <template v-if="headersAsObj[header].type === 'multi-category'">
              <div class="display-text" :ref="`span-${currentTable}-${colIndex}-${rowIndex}`">
                <h-tag v-for="val in getLabelFromValue(row[header].value, headersAsObj[header].selectOptions)"
                       :key="`${val}-${colIndex}-${rowIndex}`">{{ val }}</h-tag>
              </div>
              <h-select
                :ref="`vsSelect-${currentTable}-${colIndex}-${rowIndex}`"
                v-model="row[header].value"
                multiple
                :options="headersAsObj[header].selectOptions"
                @change="inputHandleChange($event, header, rowIndex, colIndex)"
                @keyup.esc="escKeyup(row[header], rowIndex, header, colIndex, headersAsObj[header].type)"
              />
            </template>

            <template v-if="headersAsObj[header].type === 'boolean'">
              <span class="display-text" :ref="`span-${currentTable}-${colIndex}-${rowIndex}`">
                {{ formatValue(headersAsObj[header].type, row[header].value) }}
              </span>
              <div class="h-checkbox">
                <el-checkbox
                  class=""
                  v-model="row[header].value"
                  :ref="`checkbox-${currentTable}-${colIndex}-${rowIndex}`"
                  @change="inputHandleChange($event, header, rowIndex, colIndex)"
                />
              </div>
            </template>
          </td>
        </template>
      </tr>
    </template>
  </tbody>
</template>

<script type="text/javascript" src="./TBody.js"></script>

<style lang="scss" src="./TBody.scss"></style>

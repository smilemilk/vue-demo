<template>
    <div
        :class="wraperClasses"
        ref="wraper"
        @mouseup="handleMouseup"
        @mousemove="handleMousemove"
        @mouseleave="handleMouseout">
        <div v-if="direction === 'horizontal'" :class="`${prefix}-container`">
            <div :class="`${prefix}-left-area`" :style="{width: leftSize}">
                <slot name="left"></slot>
            </div>
            <slot name="trigger">
                <div
                    :class="`${prefix}-trigger`"
                    ref="trigger"
                    :style="horizontalTriggerStyle"
                    @mousedown="handleMousedown"
                    unselectable="on">
					<div class="trigger-middle-point"><p></p><p></p><p></p><p></p><p></p><p></p></div>
                </div>
            </slot>
            <div :class="`${prefix}-right-area`" :style="{width: rightSize}">
                <slot name="right"></slot>
            </div>
        </div>

        <div v-else :class="`${prefix}-container`">
            <div :class="`${prefix}-top-area`" :style="{height: leftSize}">
                <slot name="top"></slot>
            </div>
            <slot name="trigger">
                <div
                    :class="`${prefix}-trigger`"
                    ref="trigger"
                    :style="verticalTriggerStyle"
                    @mousedown="handleMousedown"
                    unselectable="on">
					<div class="trigger-middle-point"><p></p><p></p><p></p><p></p><p></p><p></p></div>
                </div>
            </slot>
            <div :class="`${prefix}-bottom-area`" :style="{height: rightSize}">
                <slot name="bottom"></slot>
            </div>
        </div>
    </div>
</template>

<script>
const oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};
export default {
    name: 'splitPane',
    props: {
        value: {
            type: [Number, String],
            default: 50
        },
        direction: {
            type: String,
            default: 'horizontal',
            validator (val) {
                return oneOf(val, ['vertical', 'horizontal']);
            }
        },
        min: {
            type: [Number, String],
            default: 3
        },
        max: {
            type: [Number, String],
            default: 97
        },
        maxRight: {
            type: Boolean,
            default: false
        },
        right: {
            type: Boolean,
            default: false
        },
        triggerStyle: {
            type: Object,
            default () {
                if (this.direction === 'horizontal') {
                    return {
                        width: '4px',
                        background: '#BDBDBD'
                    };
                } else {
                    return {
                        height: '4px',
                        background: '#BDBDBD'
                    };
                }
            }
        }
    },
    data () {
        return {
            prefix: 'split-pane',
            canMove: false,
            triggerOffset: 50,
            triggerOldOffset: 50,
            offset: {},
            atMin: false,
            atMax: false,
            directionMark: 0
        };
    },
    computed: {
        wraperClasses () {
            return [
                this.prefix,
                this.direction === 'vertical' ? `${this.prefix}-vertical` : `${this.prefix}-horizontal`
            ];
        },
        leftSize () {
            return this.right ? `${100 - this.triggerOffset}%` : `${this.triggerOffset}%`;
        },
        rightSize () {
            return this.right ? `${this.triggerOffset}%` : `${100 - this.triggerOffset}%`;
        },
        triggerLeft () {
            return this.right ? `${100 - this.triggerOffset}%` : `${this.triggerOffset}%`;
        },
        minTransed () {
            return this.transValue(this.min);
        },
        maxTransed () {
            let max = this.right ? (100 - this.transValue(this.max)) : this.transValue(this.max);
            return this.maxRight ? 100 - max : max;
        },
        horizontalTriggerStyle () {
            return Object.assign({left: this.triggerLeft}, this.triggerStyle);
        },
        verticalTriggerStyle () {
            return Object.assign({top: this.triggerLeft}, this.triggerStyle);
        }
    },
    methods: {
        handleMouseup (e) {
            this.canMove = false;
            this.$emit('on-resizing-end', e);
        },
        transValue (val) {
            return (typeof val === 'number') ? val : Math.floor(((parseFloat(val) / this.$refs.wraper.offsetWidth) * 10000)) / 100;
        },
        handleMousedown (e) {
            this.canMove = true;
            this.triggerOldOffset = this.triggerOffset;
            this.offset = {
                x: e.pageX,
                y: e.pageY
            };
            this.$emit('on-resizing-start', e);
            e.preventDefault();
        },
        handleMouseout () {
            this.canMove = false;
        },
        handleMousemove (e) {
            if (this.canMove) {
                let offset;
                let moveSize = 0;
                if (this.direction === 'horizontal') {
                    moveSize = Math.floor(((e.clientX - this.offset.x) / this.$refs.wraper.offsetWidth) * 10000) / 100;
                    offset = this.triggerOldOffset + (this.right ? -moveSize : moveSize);
                } else {
                    moveSize = Math.floor(((e.clientY - this.offset.y) / this.$refs.wraper.offsetHeight) * 10000) / 100;
                    offset = this.triggerOldOffset + (this.right ? -moveSize : moveSize);
                }
                if (this.right) {
                    let offsetHandle = 100 - offset;
                    if (offsetHandle <= this.minTransed) {
                        this.triggerOffset = 100 - Math.max(offsetHandle, this.minTransed);
                    } else {
                        this.triggerOffset = 100 - Math.min(offsetHandle, this.maxTransed);
                    }
                } else {
                    if (offset <= this.minTransed) {
                        this.triggerOffset = Math.max(offset, this.minTransed);
                    } else {
                        this.triggerOffset = Math.min(offset, this.maxTransed);
                    }
                }
                e.atMin = (100 - offset) <= this.minTransed;
                e.atMax = (100 - offset) >= this.maxTransed;
                if (e.pageX > this.directionMark) {
                    e.direction = 1;
                } else {
                    e.direction = 0;
                }
                this.directionMark = e.pageX;
                this.$emit('input', this.triggerOffset);
                this.$emit('on-resizing', e);
            }
        },
        setTriggerOffset (offset) {
            this.$nextTick(() => {
                this.triggerOffset = (typeof offset === 'number') ? offset : Math.floor(((parseInt(offset) / this.$refs.wraper.offsetWidth) * 10000)) / 100;
                this.$emit('input', this.triggerOffset);
            });
        }
    },
    watch: {
        value (val) {
            this.$nextTick(() => {
                this.triggerOffset = (typeof val === 'number') ? val : Math.floor(((parseInt(val) / this.$refs.wraper.offsetWidth) * 10000)) / 100;
            });
        }
    },
    mounted () {
        if (this.value !== undefined) {
            this.$nextTick(() => {
                this.triggerOffset = (typeof this.value === 'number') ? this.value : Math.floor(((parseInt(this.value) / this.$refs.wraper.offsetWidth) * 10000)) / 100;
            });
            this.triggerOffset = (typeof this.value === 'number') ? this.value : Math.floor(((parseInt(this.value) / this.$refs.wraper.offsetWidth) * 10000)) / 100;
        }
    }
};
</script>

<style lang="less" scoped>
    @prefix: ~"split-pane";
    @container: ~"@{prefix}-container";
    @trigger: ~"@{prefix}-trigger";

    .@{prefix}{
        position: relative;
        &-container{
            height: 100%;
            width: 100%;
        }

        &-horizontal{
            & > div > .@{trigger}{
                transform: translateX(-50%);
                cursor: col-resize;
                width: 8px;
                height: 100%;
                margin: 0 1px;
                .trigger-middle-point{
                    width: 3px;
                    height: 20px;
                    p{
                        width: 100%;
                        height: 1px;
                        margin-top: 2px;
                    }
                }
            }
        }

        &-vertical{
            & > div > .@{trigger}{
                transform: translateY(-50%);
                cursor: row-resize;
                height: 8px;
                width: 100%;
                margin: 1px 0;
                .trigger-middle-point{
                    width: 20px;
                    height: 3px;
                    p{
                        height: 100%;
                        width: 1px;
                        display: inline-block;
                        margin-left: 2px;
                    }
                }
            }
        }

        &-trigger{
            position: absolute;
            z-index: 3;
            background: #F8F8F9;
            box-shadow: 0 0 4px 0 rgba(28,36,56,0.32);
            .trigger-middle-point{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-87%);
                line-height: 0px;
                p{
                    background: rgba(23,35,61,0.25);
                }
            }
        }

        &-left-area{
            height: 100%;
            float: left;
            z-index: 2;
            // overflow: auto;
        }

        &-right-area{
            height: 100%;
            float: left;
            z-index: 2;
            // overflow: auto;
        }

        &-top-area{
            width: 100%;
            z-index: 2;
            // overflow: auto;
        }

        &-bottom-area{
            width: 100%;
            z-index: 2;
            // overflow: auto;
        }
    }
</style>

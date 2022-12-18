<template>
    <v-chip text>
        <v-avatar left>
            <v-img :src="avatar" contain></v-img>
        </v-avatar>
        {{ user.name }}
    </v-chip>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Vue from 'vue';
import { identicon } from 'minidenticons';
import { UserSimple } from '~/src';

@Component({
    props: {
        user: {
            type: Object,
            required: true
        }
    }
})
export default class ChipAvatar extends Vue {
    @Prop({ required: true }) user!: UserSimple
    get avatar() {
        if (this.user.avatar.trim().length > 0) {
            return `/image/50/${this.user.avatar}`
        } else {
            const data = identicon(String(this.user.id))
            const out = 'data:image/svg+xml;utf8,' + encodeURIComponent(data);
            return out
        }
    }
}
</script>
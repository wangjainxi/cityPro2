<template>
  <div class="map-wraper">
    <el-row>
      <el-col>
        <el-form-item
          label="区域"
          prop="address"
        >
          <el-autocomplete
            v-model="mapLocation.address"
            :fetch-suggestions="querySearch"
            placeholder="请输入详细地址"
            style="width: 100%"
            :trigger-on-focus="false"
            @select="handleSelect"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <baidu-map
      class="Bmap"
      ak="b0d5j5zzT76pxC5qib2Rat9YSKZM3ms5"
      :center="mapCenter"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="handlerBMap"
      @click="getPoint"
      @dblclick="getPoint"
    >

      <bm-map-type
        :map-types="['BMAP_HYBRID_MAP','BMAP_NORMAL_MAP']"
        anchor="BMAP_ANCHOR_TOP_RIGHT"
      >
        <bm-city-list
          anchor="BMAP_ANCHOR_TOP_RIGHT"
          :offset="offsetValue"
          @changeBefore="changeCity"
          @changeAfter="changeCity"
        />
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :show-address-bar="true"
          :auto-location="true"
        />
        <bm-marker :position="postionMap" />

      </bm-map-type>
    </baidu-map>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import BmGeolocation from 'vue-baidu-map/components/controls/Geolocation.vue';
import BmMapType from 'vue-baidu-map/components/controls/MapType.vue';
import BmCityList from 'vue-baidu-map/components/controls/CityList.vue';
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue';
export default {
  components: {
    BaiduMap,
    BmGeolocation,
    BmMapType,
    BmMarker,
    BmCityList
  },
  props: {
    emitPosition: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      queryString: '',
      cb: '',
      mapCenter: { lng: 0, lat: 0 },
      zoom: 3,
      mapLocation: {
        address: undefined,
        coordinate: undefined
      },
      offsetValue: { width: 100, height: 10 }
    };
  },
  methods: {
    changeCity(e) {
      console.log('changeCityp', e);
    },
    syncCenterAndZoom (e) {
      const { lng, lat } = e.target.getCenter();
      this.mapCenter.lng = lng;
      this.mapCenter.lat = lat;
      this.zoom = e.target.getZoom();
    },
    handlerBMap({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      if (this.mapLocation.coordinate && this.mapLocation.coordinate.lng) {
        this.mapCenter.lng = this.mapLocation.coordinate.lng;
        this.mapCenter.lat = this.mapLocation.coordinate.lat;
        map.addOverlay(new this.BMap.Marker(this.mapLocation.coordinate));
      } else {
        // this.mapCenter.lng = 113.271429;
        // this.mapCenter.lat = 23.135336;
      }
    },
    postionMap(e) {
      console.log('postionMap', e);
    },
    getPoint(e) {
      const region = `${this.mapLocation.address} (${e.point.lng},${e.point.lat})`;
      this.$emit('emitPosition', region);
    },
    querySearch(queryString, cb) {
      this.queryString = queryString;
      this.cb = cb;
      const BMapClass = this.BMap.Geocoder;
      const myGeo = new BMapClass();
      myGeo.getPoint(queryString, (point) => {
        if (point) {
          this.mapLocation.coordinate = point;
          this.makerCenter(point);
        } else {
          this.mapLocation.coordinate = null;
        }
      }, this.locationCity);
      const options = {
        onSearchComplete: function(results) {
          if (local.getStatus() === 0) {
            const s = [];
            for (var i = 0; i < results.getCurrentNumPois(); i++) {
              var x = results.getPoi(i);
              var item = { value: x.address + x.title, point: x.point };
              s.push(item);
              cb(s);
            }
          } else {
            cb();
          }
        }
      };
      var local = new this.BMap.LocalSearch(this.map, options);
      local.search(queryString);
    },
    handleSelect(item) {
      const { point, value } = item;
      this.mapLocation.coordinate = point;
      this.mapCenter.lng = point.lng;
      this.mapCenter.lat = point.lat;
      this.zoom = 10;
      const region = `${value} (${point.lng},${point.lat})`;
      this.$emit('emitPosition', region);
      this.makerCenter(point);
    },
    makerCenter(point) {
      if (this.map) {
        this.mapCenter.lng = point.lng;
        this.mapCenter.lat = point.lat;
        this.offsetValue = { width: 100, height: 10 };
        this.map.clearOverlays();
        this.map.addOverlay(new this.BMap.Marker(point));
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.map-wraper{
  position: relative;
}
.inputPlace{
  // position: absolute;
  left: 0;
  top: 0;
  z-index: 99
}
.Bmap {
  width: 100%;
  height: 300px;
}
</style>

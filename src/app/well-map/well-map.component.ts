/* tslint:disable */

import { environment } from '../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { markers } from "./mockdata";
import { data1 } from "./data/data1";

@Component({
  selector: 'well-map',
  templateUrl: './well-map.component.html',
  styleUrls: ['./well-map.component.css']
})
export class WellMapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v10';
  lat = 37.830348;
  lng = -122.486052;
  markers: any = markers;
  routeData: any;
  count: number = 0;
  // countList: number[];
  constructor() { }

  ngOnInit() {
    this.initMap();
    // this.addMarkers();
    this.getRouteData();
  }

  private getRouteData(): void {
    // this.routeData = data1.features[1].geometry.coordinates;
    this.routeData = data1.features.map((each) => each.geometry.coordinates);
  }

  private initMap(): void {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;

    this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 12,
        center: [
          -73.78299,
          40.64857
       ],
    });

    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on("load", () => {
      this.addMarkerSource();
      this.addMarkerLayer();
         
        // Start the animation.
      this.animateMarker();      
    });

    this.map.on("click", "point", (e) => {
      console.log(123, e);
    });
  }
 

  private animateMarker(): void {
    const routeIntervalList = [];
    const sourceList = [];
    const countList = [];
    this.routeData.forEach((each, index) => {
      const source: mapboxgl.GeoJSONSource = this.map.getSource(`point-${index}`) as mapboxgl.GeoJSONSource;
      sourceList.push(source);
      countList.push(0);
      routeIntervalList[index] = window.setInterval(() => {
        sourceList[index].setData(this.pointPosition(each[countList[index]]))
        countList[index]++;
        if (countList[index] === each.length) {
          window.clearInterval(routeIntervalList[index]);
        }
      }, 200);
    })
  }

  private pointPosition(marker): any {
    return {
      "type": "Point",
      "coordinates": [marker[0],  marker[1]]
    };
  }

  private addMarkerSource(): void {
    this.routeData.forEach((each, index) => {
      this.map.addSource(`point-${index}`, {
        type: "geojson",
        data: this.pointPosition(each[0]) // init position
      });
    })
  }

  private addMarkerLayer(): void {
    this.routeData.forEach((each, index) => {
      this.map.addLayer({
        "id": `point-${index}`,
        "source": `point-${index}`,
        "type": "circle",
        "paint": {
          "circle-radius": 5,
          "circle-color": "#ffa35c"
        }
      });
    })
  }
}
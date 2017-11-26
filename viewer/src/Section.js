// @ts-check

/*
 * sander/agenda - crawls and displays interesting design-related events
 * Copyright © 2017 Sander Dijkhuis <mail@sanderdijkhuis.nl>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component } from "react";

const BEFORE = Symbol("BEFORE");
const IN = Symbol("IN");
const AFTER = Symbol("AFTER");

export default class Section extends Component {
  state = {
    view: BEFORE,
    containerTop: 0,
    containerBottom: 0,
    headerHeight: 0
  };

  onWindowScroll = () => {
    const { containerTop, containerBottom, headerHeight } = this.state;
    const scrollTop = Math.max(
      document.body.scrollTop,
      document.documentElement.scrollTop
    );
    this.setState({
      view:
        scrollTop < containerTop
          ? BEFORE
          : scrollTop < containerBottom - headerHeight ? IN : AFTER
    });
  };

  onWindowResize = () => {
    this.onContainerRefSet(this.container);
    this.onWindowScroll();
  };

  onContainerRefSet = node => {
    const { top, bottom } = node.getBoundingClientRect();
    const { height } = this.header.getBoundingClientRect();
    const { scrollY } = window;

    this.container = node;
    this.setState({
      containerTop: top + scrollY,
      containerBottom: bottom + scrollY,
      headerHeight: height
    });
  };

  onHeaderRefSet = node => {
    this.header = node;
  };

  componentDidMount() {
    window.addEventListener("scroll", this.onWindowScroll);
    window.addEventListener("resize", this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onWindowScroll);
    window.addEventListener("resize", this.onWindowResize);
  }

  render() {
    const { header, children } = this.props;
    const { view, headerHeight } = this.state;
    return (
      <div ref={this.onContainerRefSet} style={{ position: "relative" }}>
        <div
          ref={this.onHeaderRefSet}
          style={
            view === BEFORE
              ? {}
              : view === IN
                ? { position: "fixed", top: 0, left: 0, right: 0 }
                : { position: "absolute", bottom: 0, left: 0, right: 0 }
          }
        >
          {header}
        </div>
        <div style={view === BEFORE ? {} : { paddingTop: headerHeight }}>
          {children}
        </div>
      </div>
    );
  }
}

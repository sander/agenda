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
import styled from "styled-components";

import Event, { MAX_WIDTH, PADDING } from "./Event";
import Section from "./Section";

const URL =
  "https://gist.githubusercontent.com/sander/314ce29455c4ddc0052303218855f0d9/raw/agenda.json";
const LINE = 20;
const NORMAL = 19;
const LARGE = NORMAL;
const DATE_OPTS = {
  timeZone: "Europe/Amsterdam",
  hour12: false,
  weekday: "short",
  month: "short",
  day: "numeric"
};

const View = styled.main`
  background: #eee;
  color: #005bb8;
  font-family: NG_sdnl, "Helvetica Neue", sans-serif;
  line-height: ${LINE}px;
  font-size: ${NORMAL}px;
  min-height: 100vh;
  font-weight: 400;
`;

const Info = styled.p`
  margin: 0 auto;
  padding: ${PADDING + 2 * LINE}px ${PADDING}px ${2 * LINE}px ${PADDING}px;
  max-width: ${MAX_WIDTH};
`;

const DayHeading = styled.h1`
  font-size: ${LARGE}px;
  font-weight: 700;
  line-height: ${2 * LINE}px;
  text-transform: uppercase;
  padding: 0 ${PADDING}px 0 ${PADDING}px;
  margin: 0 auto;
  max-width: ${MAX_WIDTH};
  color: #021120;
`;

const Link = styled.a`
  text-decoration: underline;
  color: inherit;
`;

const Loader = styled.p`
  margin: 0;
  text-align: center;
  line-height: 100vh;
`;

var group = (arr, fn) =>
  arr.reduce((result, v) => {
    const val = fn(v);
    (result[val] = result[val] || []).push(v);
    return result;
  }, {});

const date = ({ date, start, end }) =>
  (start && end && start.substr(0, 10) !== end.substr(0, 10)
    ? `${new Date(start).toLocaleDateString("nl-NL", DATE_OPTS)} – ${new Date(
        end
      ).toLocaleDateString("nl-NL", { ...DATE_OPTS, year: "numeric" })}`
    : new Date(date || start).toLocaleDateString("nl-NL", {
        ...DATE_OPTS,
        year: "numeric"
      })
  ).replace(/\./g, "");

export default class App extends Component {
  state = { index: null };

  async componentDidMount() {
    const response = await fetch(URL);
    const index = await response.json();
    this.setState({ index });
  }

  render() {
    const { index } = this.state;

    return (
      <View>
        {index ? (
          Object.entries(group(index.events, date)).map(([date, events]) => (
            <Section header={<DayHeading>{date}</DayHeading>} key={date}>
              {events.map(e => <Event key={e.id} {...e} />)}
            </Section>
          ))
        ) : (
          <Loader>Laden…</Loader>
        )}
        {index ? (
          <Info>
            Verzameld op{" "}
            {new Date(index.updated)
              .toLocaleDateString("nl-NL", DATE_OPTS)
              .replace(".", "")},{" "}
            {new Date(index.updated).toLocaleTimeString("nl-NL")} door{" "}
            <Link href="https://github.com/sander/agenda">
              github.com/sander/agenda
            </Link>
          </Info>
        ) : null}
      </View>
    );
  }
}

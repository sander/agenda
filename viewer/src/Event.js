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

import React from "react";
import styled from "styled-components";

const tagDisplay = {
  "nl.dezwijger": "PDZ*",
  "org.waag": "Waag",
  "com.meetup": "Meetup",
  "nl.hetnieuweinstituut": "HNI"
};

export const SMALL = 15;
export const MAX_WIDTH = "700px";
export const PADDING = 15;

const Link = styled.a`
  color: inherit;
  text-decoration: none;
  display: block;
  border-top: 0.5px solid #7fa6d2;
  border-bottom: 0.5px solid #7fa6d2;
  max-width: ${MAX_WIDTH};
  margin: 0 auto;
  padding: ${PADDING}px;

  & + & {
    border-top: none;
  }
  &:last-child {
    border-bottom-width: 2px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  &:active,
  &:focus {
    background-color: white;
  }
`;

const View = styled.article`
  display: grid;
  grid-gap: 0.5rem 1rem;
  grid-template-columns: 1fr 5fr;
  grid-template-areas: "time header" "_ description" "tag meta";
`;

const Header = styled.header`
  grid-area: header;
`;

const Time = styled.div`
  grid-area: time;
`;

const Tag = styled.div`
  grid-area: tag;
  font-size: ${SMALL}px;
`;

const SupTitle = styled.h2`
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
`;

const Title = styled.h1`
  font-size: inherit;
  margin: 0;
  text-transform: uppercase;
  font-weight: inherit;
`;

const Description = styled.p`
  grid-area: description;
  font-size: ${SMALL}px;
  margin: 0;
`;

const Meta = styled.p`
  margin: 0;
  grid-area: meta;
  font-size: ${SMALL}px;
`;

const humaneTime = ds =>
  new Date(ds).toLocaleTimeString("nl-NL", {
    hour: "numeric",
    minute: "2-digit"
  });

const Event = ({
  url,
  tag,
  date,
  start,
  end,
  title,
  suptitle,
  description,
  location
}) => (
  <Link href={url}>
    <View>
      <Header>
        <SupTitle>{suptitle}</SupTitle>
        <Title>{title.replace("ij", "ĳ").replace("IJ", "Ĳ")}</Title>
      </Header>
      <Description>{description}</Description>
      <Time>
        {humaneTime(date || start)}
        {end ? ` – ${humaneTime(end)}` : null}
      </Time>
      <Tag>{tagDisplay[tag]}</Tag>
      <Meta>{location ? location : null}</Meta>
    </View>
  </Link>
);

export default Event;

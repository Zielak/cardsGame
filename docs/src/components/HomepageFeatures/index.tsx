/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-var-requires */
import clsx from "clsx"
import React from "react"

import styles from "./styles.module.css"

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<"svg">>
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: "Commands and conditions",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <p>
        Define your games rules using intuitive and flexible tools, don't hard
        code it.
      </p>
    ),
  },
  {
    title: "Play against bots",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <p>
        Provide a bit of guidance for the bots to try and make interesting
        decisions.
      </p>
    ),
  },
  {
    title: "TODO: Game variants",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <p>
        Most classic card games play different in different regions. Let players
        choose the exact flavour of your game.
      </p>
    ),
  },
  {
    title: "Powered by Colyseus",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <p>
        Open-source, authoritative, multiplayer framework:&nbsp;
        <a href="https://www.colyseus.io/" rel="noopener" target="_blank">
          Colyseus.io
        </a>
      </p>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem): JSX.Element {
  return (
    <div className={clsx("col col--6")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        {description}
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}

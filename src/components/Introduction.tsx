import { AuraBeam, AuraBeamAnnotator, AuraBeamBody, AuraBeamTitle, AuraBeamVerticalDivider } from 'aura-beam-annotator'
import React from 'react'
import { introductionText } from './introductionText'

export const Introduction = () => {
    const colors = ["lime", "green", "emerald", "teal", "cyan", "sky"]
    let positioning: "left" | "right" = "right"
    return (
        <div>
            <AuraBeam>
                {introductionText.map((section, index) => {
                    positioning = positioning === "left" ? "right" : "left"
                    return (
                        <>
                            <AuraBeamAnnotator key={section.title} positioning={positioning} color={colors[index] || "lime"}>
                                <AuraBeamTitle title={section.title} positioning={positioning} />
                                <AuraBeamBody positioning={positioning}>
                                    {section.description}
                                </AuraBeamBody>
                                {section.subtitles.map((subtitle, index) => {
                                    return (
                                        <>
                                            <AuraBeamTitle title={subtitle.title} type='secondary' positioning={positioning} />
                                            <AuraBeamBody positioning={positioning}>
                                                {subtitle.description}
                                            </AuraBeamBody>
                                        </>
                                    )
                                }
                                )}
                            </AuraBeamAnnotator>
                            {index < introductionText.length - 1 ?
                                <AuraBeamVerticalDivider
                                    color={colors[index + 1]}
                                    direction={positioning === "left" ? "l-to-r" : "r-to-l"} /> : null}
                        </>
                    )
                })}
            </AuraBeam>
        </div>
    )
}

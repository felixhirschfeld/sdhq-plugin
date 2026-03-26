import { ButtonItem, Navigation, PanelSection } from "@decky/ui"
import parse from "html-react-parser"
import { ReactNode } from "react"

import { Scrollable, scrollableRef, ScrollArea } from "../components/scrollable"
import { GameReview } from "../sdhq-types"

type ReviewPageProps = {
	review: GameReview
	setPage: (page: "home" | "review") => void
}

const SDHQSetting = ({
	title,
	value,
	titleTop,
}: {
	title: string
	value: ReactNode
	titleTop?: boolean
}) => (
	<div
		style={{
			backgroundColor: "#303647",
			textAlign: "center",
			display: "flex",
			flexDirection: "column",
			gap: "0px",
			color: "white",
			margin: "2px",
			padding: "1rem",
			whiteSpace: "pre-wrap",
		}}
	>
		{!titleTop ? <h3 style={{ margin: "0px" }}>{value}</h3> : null}
		<small>{title}</small>
		{titleTop ? <h3 style={{ margin: "0px" }}>{value}</h3> : null}
	</div>
)

export const ReviewPage = ({ review, setPage }: ReviewPageProps) => {
	const ref = scrollableRef()
	return (
		<Scrollable ref={ref}>
			<PanelSection title={review.title.rendered}>
				<ButtonItem layout="inline" onClick={() => setPage("home")}>
					Go Home
				</ButtonItem>
			</PanelSection>
			<ScrollArea scrollable={ref}>
				<PanelSection title="SteamOS">
					<div style={{ grid: "1", columns: "2" }}>
						<SDHQSetting
							title="Limit"
							value={`${review.acf.optimized_and_recommended_settings.steamos_settings.fps_cap} FPS`}
						/>
						<SDHQSetting
							title="Refresh Rate"
							value={`${review.acf.optimized_and_recommended_settings.steamos_settings.fps_refresh_rate}`}
						/>
					</div>
					<div style={{ grid: "1", columns: "2" }}>
						<SDHQSetting
							title="HRS"
							titleTop
							value={
								review.acf.optimized_and_recommended_settings
									.steamos_settings.half_rate_shading
									? "YES"
									: "NO"
							}
						/>
						<SDHQSetting
							title="TDP Limit"
							titleTop
							value={
								review.acf.optimized_and_recommended_settings
									.steamos_settings.tdp_limit
							}
						/>
					</div>
					<div style={{ grid: "1", columns: "2" }}>
						<SDHQSetting
							title="Scaling Filter"
							titleTop
							value={
								review.acf.optimized_and_recommended_settings
									.steamos_settings.scaling_filter
							}
						/>
						<SDHQSetting
							title="GPU Clock"
							titleTop
							value={
								review.acf.optimized_and_recommended_settings
									.steamos_settings.gpu_clock_frequency
							}
						/>
					</div>
				</PanelSection>
				<PanelSection title="Proton Version">
					<SDHQSetting
						value={
							review.acf.optimized_and_recommended_settings
								.proton_version
						}
						title=""
					/>
				</PanelSection>
				<PanelSection title="Game Settings">
					<SDHQSetting
						value={parse(
							review.acf.optimized_and_recommended_settings.game_settings.replace(
								/<strong/g,
								'<strong style="font-weight: bolder"'
							)
						)}
						title=""
					/>
				</PanelSection>
				<PanelSection title="Projected Battery Usage and Temp">
					<SDHQSetting
						value={
							review.acf.optimized_and_recommended_settings
								.projected_battery_usage_and_temperature.wattage
						}
						title="Wattage"
					/>
					<SDHQSetting
						value={
							review.acf.optimized_and_recommended_settings
								.projected_battery_usage_and_temperature
								.temperatures
						}
						title="Temperature"
					/>
					<SDHQSetting
						value={
							review.acf.optimized_and_recommended_settings
								.projected_battery_usage_and_temperature
								.gameplay_time
						}
						title="Gameplay Time"
					/>
				</PanelSection>
			</ScrollArea>
			<PanelSection title="Review">
				<ButtonItem
					layout="below"
					onClick={() =>
						Navigation.NavigateToExternalWeb(review.link)
					}
				>
					Read Full Review
				</ButtonItem>
			</PanelSection>
		</Scrollable>
	)
}

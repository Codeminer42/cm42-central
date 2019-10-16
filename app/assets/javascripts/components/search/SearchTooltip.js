import React from 'react';

const SearchTooltip = ({ aditionalClass = '' }) =>
  <div className={`col-sm-12 ${aditionalClass}`} data-id="search-tooltip">
    <div className="tooltip-header">
      <h4>{ I18n.t('projects.search_tooltip.title') }</h4>
      <ul>
        <li><span>{ I18n.t('projects.search_tooltip.syntax') }</span></li>
        <li><p>{ I18n.t('projects.search_tooltip.example',{story: I18n.t('activerecord.models.story.one')}) }</p></li>
      </ul>
    </div>
    <div className="col-sm-6 tooltip-content">
      <ul>
        <li><p>{ I18n.t('projects.search_tooltip.properties') }</p></li>
        <li><span><b>title:</b> { I18n.t('activerecord.models.story.one') }</span></li>
        <li><span><b>labels:</b> Bug</span></li>
        <li><span><b>estimate:</b> 3</span></li>
        <li><span><b>type:</b> { I18n.t('story.type.feature') }</span></li>
      </ul>
      <br />
      <ul>
        <li><p>{ I18n.t('projects.search_tooltip.people') }</p></li>
        <li><span><b>Initials:</b> FB</span></li>
        <li><span><b>owner:</b> Foo Bar</span></li>
        <li><span><b>Requester:</b> Foo Bar</span></li>
      </ul>
      <br />
    </div>
    <div className="col-sm-6 tooltip-content">
      <ul>
        <li><p>&nbsp;</p></li>
        <li><span><b>state:</b> { I18n.t('story.state.unscheduled') }</span></li>
        <li>
          <span><b>created_at:</b> 2017/10/20</span></li>
        <li><span><b>release_date:</b> 2017/10/30</span></li>
      </ul>
    </div>
  </div>

export default SearchTooltip;

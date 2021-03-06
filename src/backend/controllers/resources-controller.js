/* eslint-disable object-curly-newline */
/* eslint no-unused-vars: 0 */
const { unflatten, flatten } = require('flat')
const BaseController = require('./base-controller.js')

class ResourcesController extends BaseController {
  async index({ params, query, payload }, response) {
    this.findResources(params)
    this.data.records = await this.findRecords({ query })
    return this.render('pages/list', this.data)
  }

  async resourceAction(request, response) {
    this.findResources(request.params)
    this.data.action = this.data.resource.decorate().resourceActions()
      .find(a => a.name === request.params.action)
    const actionOutput = await this.data.action.handler(request, response, {
      _admin: this.data._admin,
      h: this.data.h,
      resource: this.data.resource,
      action: this.data.action,
    })

    // When action returns string - just render it
    if (typeof actionOutput === 'string') {
      return this.render('pages/resource-action', { ...this.data, actionOutput })
    }
    // Otherwise we assume that there is an redirect and we return it
    return actionOutput
  }

  async recordAction(request, response) {
    this.findResources(request.params)
    this.data.record = await this.data.resource.findOne(request.params.recordId)
    this.data.action = this.data.resource.decorate().recordActions(this.data.record)
      .find(a => a.name === request.params.action)

    const actionOutput = await this.data.action.handler(request, response, {
      _admin: this.data._admin,
      h: this.data.h,
      resource: this.data.resource,
      action: this.data.action,
      record: this.data.record,
    })

    // When action returns string - just render it
    if (typeof actionOutput === 'string') {
      return this.render('pages/record-action', { ...this.data, actionOutput })
    }
    // Otherwise we assume that there is an redirect and we return it
    return actionOutput
  }

  findResources({ resourceId }) {
    this.data.resource = this._admin.findResource(resourceId)
    this.data.properties = this.data.resource.properties()
  }

  async findRecords({ query }) {
    this.data.perPage = 10
    const firstProperty = this.data.resource.decorate().getListProperties()[0]
    const { page, sortBy, direction, filters } = unflatten(query)
    this.data.page = Number(page) || 1
    this.data.sort = {
      sortBy: sortBy || firstProperty.name(),
      direction: direction || 'asc',
    }
    this.data.filters = filters ? flatten({ filters }) : {}
    const records = await this.data.resource.find(filters, {
      limit: this.data.perPage,
      offset: (this.data.page - 1) * this.data.perPage,
      sort: this.data.sort,
    })
    this.data.total = await this.data.resource.count(filters)
    return records
  }
}

module.exports = ResourcesController

import { categories, getProjectById, projects } from '../data/projects'

export const projectService = {
  async listProjects(category = 'all') {
    return category === 'all' ? projects : projects.filter((project) => project.category === category)
  },
  async listCategories() {
    return categories
  },
  async getProject(id: string) {
    return getProjectById(id)
  },
}

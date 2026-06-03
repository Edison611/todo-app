class TasksController < ApplicationController
  def index
    tasks = Task.includes(:tag)
    render json: tasks.as_json(include: :tag)
  end

  def show
    task = Task.includes(:tag).find(params[:id])
    render json: task.as_json(include: :tag)
  end

  def create
    task = Task.new(task_params)

    if task.save
      render json: task.as_json(include: :tag), status: :created
    else
      render json: task.errors, status: :unprocessable_entity
    end
  end

  def update
    task = Task.find(params[:id])

    if task.update(task_params)
      render json: task.as_json(include: :tag)
    else
      render json: task.errors, status: :unprocessable_entity
    end
  end

  def destroy
    Task.find(params[:id]).destroy
    head :no_content
  end

  private

  def task_params
    params.require(:task).permit(:title, :priority, :complete, :tag_id)
  end
end